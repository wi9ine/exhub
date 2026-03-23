import { ExHubConfigurationError, resolveBaseUrl, sha512Base64, toQueryString } from "@exhub/core";
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

const GOPAX_DEFAULT_BASE_URL = "https://api.gopax.co.kr";
const GOPAX_PRIVATE_PATHS = {
  balances: "/balances",
  orders: "/orders",
  trades: "/trades",
  depositWithdrawalStatus: "/deposit-withdrawal-status",
  cryptoDepositAddresses: "/crypto-deposit-addresses",
  cryptoWithdrawalAddresses: "/crypto-withdrawal-addresses",
} as const;

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

function createPublicRequestConfig(baseURL: string, timeout: number): AxiosRequestConfig {
  return {
    baseURL,
    timeout,
  };
}

async function resolveCredentials(options: GopaxClientOptions): Promise<GopaxCredentials> {
  if (options.credentialsProvider) {
    return options.credentialsProvider();
  }
  if (options.credentials) {
    return options.credentials;
  }
  throw new ExHubConfigurationError("GOPAX 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig<TInput extends GopaxSignedQueryInput = undefined>(
  options: GopaxClientOptions,
  baseURL: string,
  timeout: number,
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
      baseURL,
      timeout,
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
  const baseURL = resolveBaseUrl(GOPAX_DEFAULT_BASE_URL, options.baseURL);
  const timeout = options.timeout ?? 10_000;

  return {
    market: {
      assets: async () =>
        (await publicApi.getassets(createPublicRequestConfig(baseURL, timeout))).data,
      tradingPairs: async () =>
        (await publicApi.gettradingpairs(createPublicRequestConfig(baseURL, timeout))).data,
      priceTickSize: async (tradingPair) =>
        (
          await publicApi.gettradingpairstradingpairpriceticksize(
            tradingPair,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      ticker: async (tradingPair) =>
        (
          await publicApi.gettradingpairstradingpairticker(
            tradingPair,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      orderbook: async (tradingPair, params) =>
        (
          await publicApi.gettradingpairstradingpairbook(
            tradingPair,
            params,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      trades: async (tradingPair, params) =>
        (
          await publicApi.gettradingpairstradingpairtrades(
            tradingPair,
            params,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      stats: async (tradingPair) =>
        (
          await publicApi.gettradingpairstradingpairstats(
            tradingPair,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      allStats: async () =>
        (await publicApi.gettradingpairsstats(createPublicRequestConfig(baseURL, timeout))).data,
      candles: async (tradingPair, params) =>
        (
          await publicApi.gettradingpairstradingpaircandles(
            tradingPair,
            params,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      cautions: async (params) =>
        (
          await publicApi.gettradingpairscautions(
            params,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      tickers: async () =>
        (await publicApi.gettickers(createPublicRequestConfig(baseURL, timeout))).data,
      time: async () => (await publicApi.gettime(createPublicRequestConfig(baseURL, timeout))).data,
      notices: async (params) =>
        (await publicApi.getnotices(params, createPublicRequestConfig(baseURL, timeout))).data,
    },
    account: {
      getBalances: async () => {
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          "GET",
          GOPAX_PRIVATE_PATHS.balances,
        );
        return (await privateApi.getbalances(requestConfig)).data;
      },
      getBalance: async (assetName) => {
        const encodedAssetName = encodePathSegment(assetName);
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          "GET",
          `${GOPAX_PRIVATE_PATHS.balances}/${encodedAssetName}`,
        );
        return (await privateApi.getbalancesassetname(encodedAssetName, requestConfig)).data;
      },
    },
    orders: {
      getOrders: async (params) => {
        const { requestConfig } = await createPrivateRequestConfig<GetordersParams>(
          options,
          baseURL,
          timeout,
          "GET",
          GOPAX_PRIVATE_PATHS.orders,
          params,
          undefined,
          true,
        );
        return (await privateApi.getorders(params, requestConfig)).data;
      },
      getOrder: async (orderId) => {
        const encodedOrderId = encodePathSegment(orderId);
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          "GET",
          `${GOPAX_PRIVATE_PATHS.orders}/${encodedOrderId}`,
        );
        return (await privateApi.getordersorderid(encodedOrderId, requestConfig)).data;
      },
    },
    trades: {
      getTrades: async (params) => {
        const { requestConfig } = await createPrivateRequestConfig<GettradesParams>(
          options,
          baseURL,
          timeout,
          "GET",
          GOPAX_PRIVATE_PATHS.trades,
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
            baseURL,
            timeout,
            "GET",
            GOPAX_PRIVATE_PATHS.depositWithdrawalStatus,
            params,
          );
        return (await privateApi.getdepositwithdrawalstatus(params, requestConfig)).data;
      },
      getCryptoDepositAddresses: async () => {
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          "GET",
          GOPAX_PRIVATE_PATHS.cryptoDepositAddresses,
        );
        return (await privateApi.getcryptodepositaddresses(requestConfig)).data;
      },
      getCryptoWithdrawalAddresses: async () => {
        const { requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          "GET",
          GOPAX_PRIVATE_PATHS.cryptoWithdrawalAddresses,
        );
        return (await privateApi.getcryptowithdrawaladdresses(requestConfig)).data;
      },
    },
  };
}
