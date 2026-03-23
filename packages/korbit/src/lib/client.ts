import { ExHubConfigurationError, hmacSha256Hex, resolveBaseUrl, toQueryString } from "@exhub/core";
import type { AxiosRequestConfig } from "axios";

import * as privateApi from "../generated/private";
import * as publicApi from "../generated/public";
import type {
  KorbitClient,
  KorbitClientOptions,
  KorbitCredentials,
  KorbitSignedParamsInput,
} from "./types";

const KORBIT_DEFAULT_BASE_URL = "https://api.korbit.co.kr";

function createPublicRequestConfig(baseURL: string, timeout: number): AxiosRequestConfig {
  return {
    baseURL,
    timeout,
  };
}

async function resolveCredentials(options: KorbitClientOptions): Promise<KorbitCredentials> {
  if (options.credentialsProvider) {
    return options.credentialsProvider();
  }
  if (options.credentials) {
    return options.credentials;
  }
  throw new ExHubConfigurationError("Korbit 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig(
  options: KorbitClientOptions,
  baseURL: string,
  timeout: number,
): Promise<{
  signedParams: {
    timestamp: number;
    signature: string;
    recvWindow: number;
  };
  requestConfig: AxiosRequestConfig;
}>;
async function createPrivateRequestConfig<TInput extends Record<string, unknown>>(
  options: KorbitClientOptions,
  baseURL: string,
  timeout: number,
  params: TInput,
): Promise<{
  signedParams: TInput & {
    timestamp: number;
    signature: string;
    recvWindow: number;
  };
  requestConfig: AxiosRequestConfig;
}>;
async function createPrivateRequestConfig(
  options: KorbitClientOptions,
  baseURL: string,
  timeout: number,
  params?: KorbitSignedParamsInput,
): Promise<{
  signedParams:
    | {
        timestamp: number;
        signature: string;
        recvWindow: number;
      }
    | (Record<string, unknown> & {
        timestamp: number;
        signature: string;
        recvWindow: number;
      });
  requestConfig: AxiosRequestConfig;
}> {
  const credentials = await resolveCredentials(options);
  const timestamp = Date.now();
  const recvWindow = credentials.recvWindow ?? 5_000;
  const unsignedParams = params
    ? {
        ...params,
        timestamp,
        recvWindow,
      }
    : {
        timestamp,
        recvWindow,
      };
  const signature = hmacSha256Hex(toQueryString(unsignedParams), credentials.secretKey);
  const signedParams = {
    ...unsignedParams,
    signature,
  };

  return {
    signedParams,
    requestConfig: {
      baseURL,
      timeout,
      headers: {
        "X-KAPI-KEY": credentials.apiKey,
      },
    },
  };
}

export function createKorbitClient(options: KorbitClientOptions = {}): KorbitClient {
  const baseURL = resolveBaseUrl(KORBIT_DEFAULT_BASE_URL, options.baseURL);
  const timeout = options.timeout ?? 10_000;

  return {
    market: {
      tickers: async (params) =>
        (await publicApi.getv2tickers(params, createPublicRequestConfig(baseURL, timeout))).data,
      orderbook: async (params) =>
        (await publicApi.getv2orderbook(params, createPublicRequestConfig(baseURL, timeout))).data,
      trades: async (params) =>
        (await publicApi.getv2trades(params, createPublicRequestConfig(baseURL, timeout))).data,
      candles: async (params) =>
        (await publicApi.getv2candles(params, createPublicRequestConfig(baseURL, timeout))).data,
      currencyPairs: async () =>
        (await publicApi.getv2currencypairs(createPublicRequestConfig(baseURL, timeout))).data,
      tickSizePolicy: async (params) =>
        (await publicApi.getv2ticksizepolicy(params, createPublicRequestConfig(baseURL, timeout)))
          .data,
      currencies: async () =>
        (await publicApi.getv2currencies(createPublicRequestConfig(baseURL, timeout))).data,
      time: async () =>
        (await publicApi.getv2time(createPublicRequestConfig(baseURL, timeout))).data,
    },
    orders: {
      getOrder: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2orders(signedParams, requestConfig)).data;
      },
      getOpenOrders: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2openorders(signedParams, requestConfig)).data;
      },
      getAllOrders: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2allorders(signedParams, requestConfig)).data;
      },
      getMyTrades: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2mytrades(signedParams, requestConfig)).data;
      },
    },
    assets: {
      getBalance: async (params) => {
        const { signedParams, requestConfig } = params
          ? await createPrivateRequestConfig(options, baseURL, timeout, params)
          : await createPrivateRequestConfig(options, baseURL, timeout);
        return (await privateApi.getv2balance(signedParams, requestConfig)).data;
      },
    },
    cryptoDeposits: {
      getDepositAddresses: async () => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
        );
        return (await privateApi.getv2coindepositaddresses(signedParams, requestConfig)).data;
      },
      getDepositAddress: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2coindepositaddress(signedParams, requestConfig)).data;
      },
      getRecentDeposits: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2coinrecentdeposits(signedParams, requestConfig)).data;
      },
      getDeposit: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2coindeposit(signedParams, requestConfig)).data;
      },
    },
    cryptoWithdrawals: {
      getWithdrawableAddresses: async () => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
        );
        return (await privateApi.getv2coinwithdrawableaddresses(signedParams, requestConfig)).data;
      },
      getWithdrawableAmount: async (params) => {
        const { signedParams, requestConfig } = params
          ? await createPrivateRequestConfig(options, baseURL, timeout, params)
          : await createPrivateRequestConfig(options, baseURL, timeout);
        return (await privateApi.getv2coinwithdrawableamount(signedParams, requestConfig)).data;
      },
      getRecentWithdrawals: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2coinrecentwithdrawals(signedParams, requestConfig)).data;
      },
      getWithdrawal: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2coinwithdrawal(signedParams, requestConfig)).data;
      },
    },
    krw: {
      getRecentDeposits: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2krwrecentdeposits(signedParams, requestConfig)).data;
      },
      getRecentWithdrawals: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
          params,
        );
        return (await privateApi.getv2krwrecentwithdrawals(signedParams, requestConfig)).data;
      },
    },
    service: {
      getTradingFeePolicy: async (params) => {
        const { signedParams, requestConfig } = params
          ? await createPrivateRequestConfig(options, baseURL, timeout, params)
          : await createPrivateRequestConfig(options, baseURL, timeout);
        return (await privateApi.getv2tradingfeepolicy(signedParams, requestConfig)).data;
      },
      getCurrentKeyInfo: async () => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig(
          options,
          baseURL,
          timeout,
        );
        return (await privateApi.getv2currentkeyinfo(signedParams, requestConfig)).data;
      },
    },
  };
}
