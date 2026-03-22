import { hmacSha256Hex, resolveBaseUrl, toQueryString } from "@exhub/core";
import type { AxiosRequestConfig } from "axios";

import * as privateApi from "../generated/private";
import type {
  Getv2allordersParams,
  Getv2balanceParams,
  Getv2coindepositaddressesParams,
  Getv2coindepositaddressParams,
  Getv2coindepositParams,
  Getv2coinrecentdepositsParams,
  Getv2coinrecentwithdrawalsParams,
  Getv2coinwithdrawableaddressesParams,
  Getv2coinwithdrawableamountParams,
  Getv2coinwithdrawalParams,
  Getv2currentkeyinfoParams,
  Getv2krwrecentdepositsParams,
  Getv2krwrecentwithdrawalsParams,
  Getv2mytradesParams,
  Getv2openordersParams,
  Getv2ordersParams,
  Getv2tradingfeepolicyParams,
} from "../generated/private/model";
import * as publicApi from "../generated/public";
import type {
  KorbitClient,
  KorbitClientOptions,
  KorbitCredentials,
  KorbitSignedParamsInput,
} from "./types";

function createPublicRequestConfig(options: KorbitClientOptions): AxiosRequestConfig {
  return {
    baseURL: resolveBaseUrl("https://api.korbit.co.kr", options.baseURL),
    timeout: options.timeout ?? 10_000,
  };
}

async function resolveCredentials(options: KorbitClientOptions): Promise<KorbitCredentials> {
  if (options.credentialsProvider) {
    return options.credentialsProvider();
  }
  if (options.credentials) {
    return options.credentials;
  }
  throw new Error("Korbit 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig<
  TSignedParams extends Record<string, unknown>,
  TInput extends KorbitSignedParamsInput = undefined,
>(
  options: KorbitClientOptions,
  params?: TInput,
): Promise<{ signedParams: TSignedParams; requestConfig: AxiosRequestConfig }> {
  const credentials = await resolveCredentials(options);
  const timestamp = Date.now();
  const recvWindow = credentials.recvWindow ?? 5_000;
  const unsignedParams = {
    ...(params ?? {}),
    timestamp,
    recvWindow,
  };
  const signature = hmacSha256Hex(toQueryString(unsignedParams), credentials.secretKey);
  const signedParams = {
    ...unsignedParams,
    signature,
  } as unknown as TSignedParams;

  return {
    signedParams,
    requestConfig: {
      baseURL: resolveBaseUrl("https://api.korbit.co.kr", options.baseURL),
      timeout: options.timeout ?? 10_000,
      headers: {
        "X-KAPI-KEY": credentials.apiKey,
      },
    },
  };
}

export function createKorbitClient(options: KorbitClientOptions = {}): KorbitClient {
  return {
    market: {
      tickers: async (params) =>
        (await publicApi.getv2tickers(params, createPublicRequestConfig(options))).data,
      orderbook: async (params) =>
        (await publicApi.getv2orderbook(params, createPublicRequestConfig(options))).data,
      trades: async (params) =>
        (await publicApi.getv2trades(params, createPublicRequestConfig(options))).data,
      candles: async (params) =>
        (await publicApi.getv2candles(params, createPublicRequestConfig(options))).data,
      currencyPairs: async () =>
        (await publicApi.getv2currencypairs(createPublicRequestConfig(options))).data,
      tickSizePolicy: async (params) =>
        (await publicApi.getv2ticksizepolicy(params, createPublicRequestConfig(options))).data,
      currencies: async () =>
        (await publicApi.getv2currencies(createPublicRequestConfig(options))).data,
      time: async () => (await publicApi.getv2time(createPublicRequestConfig(options))).data,
    },
    orders: {
      getOrder: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2ordersParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2orders(signedParams, requestConfig)).data;
      },
      getOpenOrders: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2openordersParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2openorders(signedParams, requestConfig)).data;
      },
      getAllOrders: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2allordersParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2allorders(signedParams, requestConfig)).data;
      },
      getMyTrades: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2mytradesParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2mytrades(signedParams, requestConfig)).data;
      },
    },
    assets: {
      getBalance: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2balanceParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2balance(signedParams, requestConfig)).data;
      },
    },
    cryptoDeposits: {
      getDepositAddresses: async () => {
        const { signedParams, requestConfig } =
          await createPrivateRequestConfig<Getv2coindepositaddressesParams>(options);
        return (await privateApi.getv2coindepositaddresses(signedParams, requestConfig)).data;
      },
      getDepositAddress: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2coindepositaddressParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2coindepositaddress(signedParams, requestConfig)).data;
      },
      getRecentDeposits: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2coinrecentdepositsParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2coinrecentdeposits(signedParams, requestConfig)).data;
      },
      getDeposit: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2coindepositParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2coindeposit(signedParams, requestConfig)).data;
      },
    },
    cryptoWithdrawals: {
      getWithdrawableAddresses: async () => {
        const { signedParams, requestConfig } =
          await createPrivateRequestConfig<Getv2coinwithdrawableaddressesParams>(options);
        return (await privateApi.getv2coinwithdrawableaddresses(signedParams, requestConfig)).data;
      },
      getWithdrawableAmount: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2coinwithdrawableamountParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2coinwithdrawableamount(signedParams, requestConfig)).data;
      },
      getRecentWithdrawals: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2coinrecentwithdrawalsParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2coinrecentwithdrawals(signedParams, requestConfig)).data;
      },
      getWithdrawal: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2coinwithdrawalParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2coinwithdrawal(signedParams, requestConfig)).data;
      },
    },
    krw: {
      getRecentDeposits: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2krwrecentdepositsParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2krwrecentdeposits(signedParams, requestConfig)).data;
      },
      getRecentWithdrawals: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2krwrecentwithdrawalsParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2krwrecentwithdrawals(signedParams, requestConfig)).data;
      },
    },
    service: {
      getTradingFeePolicy: async (params) => {
        const { signedParams, requestConfig } = await createPrivateRequestConfig<
          Getv2tradingfeepolicyParams,
          typeof params
        >(options, params);
        return (await privateApi.getv2tradingfeepolicy(signedParams, requestConfig)).data;
      },
      getCurrentKeyInfo: async () => {
        const { signedParams, requestConfig } =
          await createPrivateRequestConfig<Getv2currentkeyinfoParams>(options);
        return (await privateApi.getv2currentkeyinfo(signedParams, requestConfig)).data;
      },
    },
  };
}
