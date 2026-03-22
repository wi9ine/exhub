import { resolveBaseUrl, sha512Base64, toQueryString } from "@exhub/core";
import type { AxiosRequestConfig } from "axios";

import * as privateApi from "../generated/private";
import type {
  GetdepositwithdrawalstatusParams,
  GetordersParams,
  GettradesParams,
} from "../generated/private/model";
import * as publicApi from "../generated/public";
import type {
  GopaxClient,
  GopaxClientOptions,
  GopaxCredentials,
  GopaxSignedQueryInput,
} from "./types";

function createPublicRequestConfig(options: GopaxClientOptions): AxiosRequestConfig {
  return {
    baseURL: resolveBaseUrl("https://api.gopax.co.kr", options.baseURL),
    timeout: options.timeout ?? 10_000,
  };
}

async function resolveCredentials(options: GopaxClientOptions): Promise<GopaxCredentials> {
  if (options.credentialsProvider) {
    return options.credentialsProvider();
  }
  if (options.credentials) {
    return options.credentials;
  }
  throw new Error("GOPAX 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig<TInput extends GopaxSignedQueryInput = undefined>(
  options: GopaxClientOptions,
  method: "GET" | "POST" | "DELETE",
  path: string,
  params?: TInput,
  body?: Record<string, unknown>,
  includeQueryInSignature = false,
): Promise<{ requestConfig: AxiosRequestConfig }> {
  const credentials = await resolveCredentials(options);
  const timestamp = String(Date.now());
  const receiveWindow = credentials.receiveWindow;
  const queryString = params ? toQueryString(params) : "";
  const signaturePath = includeQueryInSignature && queryString ? `${path}?${queryString}` : path;
  const bodyString = body ? JSON.stringify(body) : "";
  const message = `t${timestamp}${method}${signaturePath}${receiveWindow ? String(receiveWindow) : ""}${bodyString}`;
  const signature = sha512Base64(message, credentials.secretKey);

  return {
    requestConfig: {
      baseURL: resolveBaseUrl("https://api.gopax.co.kr", options.baseURL),
      timeout: options.timeout ?? 10_000,
      headers: {
        "api-key": credentials.apiKey,
        timestamp,
        signature,
        ...(receiveWindow ? { "receive-window": String(receiveWindow) } : {}),
      },
      ...(params ? { params } : {}),
    },
  };
}

export function createGopaxClient(options: GopaxClientOptions = {}): GopaxClient {
  return {
    market: {
      assets: async () => (await publicApi.getassets(createPublicRequestConfig(options))).data,
      tradingPairs: async () =>
        (await publicApi.gettradingpairs(createPublicRequestConfig(options))).data,
      priceTickSize: async (tradingPair) =>
        (
          await publicApi.gettradingpairstradingpairpriceticksize(
            tradingPair,
            createPublicRequestConfig(options),
          )
        ).data,
      ticker: async (tradingPair) =>
        (
          await publicApi.gettradingpairstradingpairticker(
            tradingPair,
            createPublicRequestConfig(options),
          )
        ).data,
      orderbook: async (tradingPair, params) =>
        (
          await publicApi.gettradingpairstradingpairbook(
            tradingPair,
            params,
            createPublicRequestConfig(options),
          )
        ).data,
      trades: async (tradingPair, params) =>
        (
          await publicApi.gettradingpairstradingpairtrades(
            tradingPair,
            params,
            createPublicRequestConfig(options),
          )
        ).data,
      stats: async (tradingPair) =>
        (
          await publicApi.gettradingpairstradingpairstats(
            tradingPair,
            createPublicRequestConfig(options),
          )
        ).data,
      allStats: async () =>
        (await publicApi.gettradingpairsstats(createPublicRequestConfig(options))).data,
      candles: async (tradingPair, params) =>
        (
          await publicApi.gettradingpairstradingpaircandles(
            tradingPair,
            params,
            createPublicRequestConfig(options),
          )
        ).data,
      cautions: async (params) =>
        (await publicApi.gettradingpairscautions(params, createPublicRequestConfig(options))).data,
      tickers: async () => (await publicApi.gettickers(createPublicRequestConfig(options))).data,
      time: async () => (await publicApi.gettime(createPublicRequestConfig(options))).data,
      notices: async (params) =>
        (await publicApi.getnotices(params, createPublicRequestConfig(options))).data,
    },
    account: {
      getBalances: async () => {
        const { requestConfig } = await createPrivateRequestConfig(options, "GET", "/balances");
        return (await privateApi.getbalances(requestConfig)).data;
      },
      getBalance: async (assetName) => {
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          "GET",
          `/balances/${assetName}`,
        );
        return (await privateApi.getbalancesassetname(assetName, requestConfig)).data;
      },
    },
    orders: {
      getOrders: async (params) => {
        const { requestConfig } = await createPrivateRequestConfig<GetordersParams>(
          options,
          "GET",
          "/orders",
          params,
          undefined,
          true,
        );
        return (await privateApi.getorders(params, requestConfig)).data;
      },
      getOrder: async (orderId) => {
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          "GET",
          `/orders/${orderId}`,
        );
        return (await privateApi.getordersorderid(orderId, requestConfig)).data;
      },
    },
    trades: {
      getTrades: async (params) => {
        const { requestConfig } = await createPrivateRequestConfig<GettradesParams>(
          options,
          "GET",
          "/trades",
          params,
        );
        return (await privateApi.gettrades(params, requestConfig)).data;
      },
    },
    wallet: {
      getDepositWithdrawalStatus: async (params) => {
        const { requestConfig } =
          await createPrivateRequestConfig<GetdepositwithdrawalstatusParams>(
            options,
            "GET",
            "/deposit-withdrawal-status",
            params,
          );
        return (await privateApi.getdepositwithdrawalstatus(params, requestConfig)).data;
      },
      getCryptoDepositAddresses: async () => {
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          "GET",
          "/crypto-deposit-addresses",
        );
        return (await privateApi.getcryptodepositaddresses(requestConfig)).data;
      },
      getCryptoWithdrawalAddresses: async () => {
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          "GET",
          "/crypto-withdrawal-addresses",
        );
        return (await privateApi.getcryptowithdrawaladdresses(requestConfig)).data;
      },
    },
  };
}
