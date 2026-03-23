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
    method: "GET" | "DELETE",
    path: string,
    params?: KorbitSignedParamsInput,
  ): Promise<TResponse> {
    const credentials = await resolveCredentials(options);
    const timestamp = Date.now();
    const recvWindow = credentials.recvWindow ?? 5_000;
    const unsignedParams = params
      ? { ...params, timestamp, recvWindow }
      : { timestamp, recvWindow };
    const signature = hmacSha256Hex(toQueryString(unsignedParams), credentials.secretKey);

    return transport.request<TResponse>({
      method,
      baseURL,
      path,
      query: { ...unsignedParams, signature },
      timeout,
      headers: { "X-KAPI-KEY": credentials.apiKey },
    });
  }

  async function requestPrivatePost<TResponse>(
    path: string,
    body?: KorbitSignedParamsInput,
  ): Promise<TResponse> {
    const credentials = await resolveCredentials(options);
    const timestamp = Date.now();
    const recvWindow = credentials.recvWindow ?? 5_000;
    const unsignedParams = body ? { ...body, timestamp, recvWindow } : { timestamp, recvWindow };
    const signature = hmacSha256Hex(toQueryString(unsignedParams), credentials.secretKey);

    return transport.request<TResponse>({
      method: "POST",
      baseURL,
      path,
      body: { ...unsignedParams, signature },
      timeout,
      headers: {
        "X-KAPI-KEY": credentials.apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
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
      placeOrder: async (body) =>
        requestPrivatePost<AsyncResult<KorbitClient["orders"]["placeOrder"]>>("/v2/orders", body),
      cancelOrder: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["cancelOrder"]>>(
          "DELETE",
          "/v2/orders",
          params,
        ),
      getOrder: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getOrder"]>>(
          "GET",
          "/v2/orders",
          params,
        ),
      getOpenOrders: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getOpenOrders"]>>(
          "GET",
          "/v2/openOrders",
          params,
        ),
      getAllOrders: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getAllOrders"]>>(
          "GET",
          "/v2/allOrders",
          params,
        ),
      getMyTrades: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getMyTrades"]>>(
          "GET",
          "/v2/myTrades",
          params,
        ),
    },
    assets: {
      getBalance: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["assets"]["getBalance"]>>(
          "GET",
          "/v2/balance",
          params,
        ),
    },
    cryptoDeposits: {
      getDepositAddresses: async () =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getDepositAddresses"]>>(
          "GET",
          "/v2/coin/depositAddresses",
        ),
      createDepositAddress: async (body) =>
        requestPrivatePost<AsyncResult<KorbitClient["cryptoDeposits"]["createDepositAddress"]>>(
          "/v2/coin/depositAddress",
          body,
        ),
      getDepositAddress: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getDepositAddress"]>>(
          "GET",
          "/v2/coin/depositAddress",
          params,
        ),
      getRecentDeposits: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getRecentDeposits"]>>(
          "GET",
          "/v2/coin/recentDeposits",
          params,
        ),
      getDeposit: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getDeposit"]>>(
          "GET",
          "/v2/coin/deposit",
          params,
        ),
    },
    cryptoWithdrawals: {
      getWithdrawableAddresses: async () =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getWithdrawableAddresses"]>>(
          "GET",
          "/v2/coin/withdrawableAddresses",
        ),
      getWithdrawableAmount: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getWithdrawableAmount"]>>(
          "GET",
          "/v2/coin/withdrawableAmount",
          params,
        ),
      withdraw: async (body) =>
        requestPrivatePost<AsyncResult<KorbitClient["cryptoWithdrawals"]["withdraw"]>>(
          "/v2/coin/withdrawal",
          body,
        ),
      cancelWithdrawal: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["cancelWithdrawal"]>>(
          "DELETE",
          "/v2/coin/withdrawal",
          params,
        ),
      getRecentWithdrawals: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getRecentWithdrawals"]>>(
          "GET",
          "/v2/coin/recentWithdrawals",
          params,
        ),
      getWithdrawal: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getWithdrawal"]>>(
          "GET",
          "/v2/coin/withdrawal",
          params,
        ),
    },
    krw: {
      sendDepositPush: async (body) =>
        requestPrivatePost<AsyncResult<KorbitClient["krw"]["sendDepositPush"]>>(
          "/v2/krw/sendKrwDepositPush",
          body,
        ),
      sendWithdrawalPush: async (body) =>
        requestPrivatePost<AsyncResult<KorbitClient["krw"]["sendWithdrawalPush"]>>(
          "/v2/krw/sendKrwWithdrawalPush",
          body,
        ),
      getRecentDeposits: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["getRecentDeposits"]>>(
          "GET",
          "/v2/krw/recentDeposits",
          params,
        ),
      getRecentWithdrawals: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["getRecentWithdrawals"]>>(
          "GET",
          "/v2/krw/recentWithdrawals",
          params,
        ),
    },
    service: {
      getTradingFeePolicy: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["service"]["getTradingFeePolicy"]>>(
          "GET",
          "/v2/tradingFeePolicy",
          params,
        ),
      getCurrentKeyInfo: async () =>
        requestPrivate<AsyncResult<KorbitClient["service"]["getCurrentKeyInfo"]>>(
          "GET",
          "/v2/currentKeyInfo",
        ),
    },
  };
}
