import {
  defaultHttpTransport,
  ExHubConfigurationError,
  hmacSha256Hex,
  resolveBaseUrl,
  toQueryString,
} from "@exhub/core";

import type {
  KorbitClient,
  KorbitClientOptions,
  KorbitCredentials,
  KorbitSignedParamsInput,
} from "./types";

const KORBIT_DEFAULT_BASE_URL = "https://api.korbit.co.kr";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

async function resolveCredentials(options: KorbitClientOptions): Promise<KorbitCredentials> {
  if (options.credentialsProvider) {
    return options.credentialsProvider();
  }
  if (options.credentials) {
    return options.credentials;
  }
  throw new ExHubConfigurationError("Korbit 인증 정보가 설정되지 않았습니다.");
}

export function createKorbitClient(options: KorbitClientOptions = {}): KorbitClient {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(KORBIT_DEFAULT_BASE_URL, options.baseURL);
  const timeout = options.timeout ?? 10_000;

  function requestPublic<TResponse>(
    path: string,
    query?: Record<string, unknown>,
  ): Promise<TResponse> {
    return transport.request<TResponse>({
      method: "GET",
      baseURL,
      path,
      query,
      timeout,
    });
  }

  async function requestPrivate<TResponse>(
    path: string,
    params?: KorbitSignedParamsInput,
  ): Promise<TResponse> {
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

    return transport.request<TResponse>({
      method: "GET",
      baseURL,
      path,
      query: {
        ...unsignedParams,
        signature,
      },
      timeout,
      headers: {
        "X-KAPI-KEY": credentials.apiKey,
      },
    });
  }

  return {
    market: {
      tickers: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["tickers"]>>("/v2/tickers", params),
      orderbook: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["orderbook"]>>("/v2/orderbook", params),
      trades: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["trades"]>>("/v2/trades", params),
      candles: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["candles"]>>("/v2/candles", params),
      currencyPairs: async () =>
        requestPublic<AsyncResult<KorbitClient["market"]["currencyPairs"]>>("/v2/currencyPairs"),
      tickSizePolicy: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["tickSizePolicy"]>>(
          "/v2/tickSizePolicy",
          params,
        ),
      currencies: async () =>
        requestPublic<AsyncResult<KorbitClient["market"]["currencies"]>>("/v2/currencies"),
      time: async () => requestPublic<AsyncResult<KorbitClient["market"]["time"]>>("/v2/time"),
    },
    orders: {
      getOrder: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getOrder"]>>("/v2/orders", params),
      getOpenOrders: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getOpenOrders"]>>(
          "/v2/openOrders",
          params,
        ),
      getAllOrders: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getAllOrders"]>>(
          "/v2/allOrders",
          params,
        ),
      getMyTrades: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getMyTrades"]>>("/v2/myTrades", params),
    },
    assets: {
      getBalance: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["assets"]["getBalance"]>>("/v2/balance", params),
    },
    cryptoDeposits: {
      getDepositAddresses: async () =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getDepositAddresses"]>>(
          "/v2/coin/depositAddresses",
        ),
      getDepositAddress: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getDepositAddress"]>>(
          "/v2/coin/depositAddress",
          params,
        ),
      getRecentDeposits: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getRecentDeposits"]>>(
          "/v2/coin/recentDeposits",
          params,
        ),
      getDeposit: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getDeposit"]>>(
          "/v2/coin/deposit",
          params,
        ),
    },
    cryptoWithdrawals: {
      getWithdrawableAddresses: async () =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getWithdrawableAddresses"]>>(
          "/v2/coin/withdrawableAddresses",
        ),
      getWithdrawableAmount: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getWithdrawableAmount"]>>(
          "/v2/coin/withdrawableAmount",
          params,
        ),
      getRecentWithdrawals: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getRecentWithdrawals"]>>(
          "/v2/coin/recentWithdrawals",
          params,
        ),
      getWithdrawal: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getWithdrawal"]>>(
          "/v2/coin/withdrawal",
          params,
        ),
    },
    krw: {
      getRecentDeposits: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["getRecentDeposits"]>>(
          "/v2/krw/recentDeposits",
          params,
        ),
      getRecentWithdrawals: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["getRecentWithdrawals"]>>(
          "/v2/krw/recentWithdrawals",
          params,
        ),
    },
    service: {
      getTradingFeePolicy: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["service"]["getTradingFeePolicy"]>>(
          "/v2/tradingFeePolicy",
          params,
        ),
      getCurrentKeyInfo: async () =>
        requestPrivate<AsyncResult<KorbitClient["service"]["getCurrentKeyInfo"]>>(
          "/v2/currentKeyInfo",
        ),
    },
  };
}
