import {
  createHs256Jwt,
  createNonce,
  defaultHttpTransport,
  ExHubConfigurationError,
  resolveBaseUrl,
  sha512HexDigest,
  toQueryString,
} from "@exhub/core";

import type { BithumbClient, BithumbClientOptions, BithumbCredentials } from "./types";

const BITHUMB_DEFAULT_BASE_URL = "https://api.bithumb.com";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

function resolveCredentials(
  options: BithumbClientOptions,
): Promise<BithumbCredentials> | BithumbCredentials {
  if (options.credentialsProvider) return options.credentialsProvider();
  if (options.credentials) return options.credentials;
  throw new ExHubConfigurationError("Bithumb 인증 정보가 설정되지 않았습니다.");
}

export function createBithumbClient(options: BithumbClientOptions = {}): BithumbClient {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(BITHUMB_DEFAULT_BASE_URL, options.baseURL);
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
    method: "GET" | "POST" | "DELETE",
    path: string,
    query?: Record<string, unknown>,
  ): Promise<TResponse> {
    const credentials = await resolveCredentials(options);
    const queryString = query ? toQueryString(query) : "";
    const tokenPayload = {
      access_key: credentials.apiKey,
      nonce: createNonce(),
      timestamp: Date.now(),
      ...(queryString
        ? {
            query_hash: sha512HexDigest(queryString),
            query_hash_alg: "SHA512",
          }
        : {}),
    };

    return transport.request<TResponse>({
      method,
      baseURL,
      path,
      query,
      timeout,
      headers: {
        Authorization: `Bearer ${createHs256Jwt(tokenPayload, credentials.secretKey)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  return {
    markets: {
      getMarkets: async (params) =>
        requestPublic<AsyncResult<BithumbClient["markets"]["getMarkets"]>>(
          "/v1/market/all",
          params,
        ),
      getMarketVirtualAssetWarning: async () =>
        requestPublic<AsyncResult<BithumbClient["markets"]["getMarketVirtualAssetWarning"]>>(
          "/v1/market/virtual_asset_warning",
        ),
    },
    candles: {
      getMinuteCandles: async (params, unit = 1) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["getMinuteCandles"]>>(
          `/v1/candles/minutes/${unit}`,
          params,
        ),
      getDayCandles: async (params) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["getDayCandles"]>>(
          "/v1/candles/days",
          params,
        ),
      getWeekCandles: async (params) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["getWeekCandles"]>>(
          "/v1/candles/weeks",
          params,
        ),
      getMonthCandles: async (params) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["getMonthCandles"]>>(
          "/v1/candles/months",
          params,
        ),
    },
    trades: {
      listTradesTicks: async (params) =>
        requestPublic<AsyncResult<BithumbClient["trades"]["listTradesTicks"]>>(
          "/v1/trades/ticks",
          params,
        ),
    },
    tickers: {
      getTicker: async (params) =>
        requestPublic<AsyncResult<BithumbClient["tickers"]["getTicker"]>>("/v1/ticker", params),
    },
    orderbook: {
      getOrderbook: async (params) =>
        requestPublic<AsyncResult<BithumbClient["orderbook"]["getOrderbook"]>>(
          "/v1/orderbook",
          params,
        ),
    },
    service: {
      listNotices: async () =>
        requestPublic<AsyncResult<BithumbClient["service"]["listNotices"]>>("/v1/notices"),
      getFeeInfo: async (currency) =>
        requestPublic<AsyncResult<BithumbClient["service"]["getFeeInfo"]>>(
          `/v2/fee/inout/${currency}`,
        ),
      getWalletStatus: async () =>
        requestPrivate<AsyncResult<BithumbClient["service"]["getWalletStatus"]>>(
          "GET",
          "/v1/status/wallet",
        ),
      listApiKeys: async () =>
        requestPrivate<AsyncResult<BithumbClient["service"]["listApiKeys"]>>(
          "GET",
          "/v1/api_keys",
        ),
    },
    accounts: {
      listAccounts: async () =>
        requestPrivate<AsyncResult<BithumbClient["accounts"]["listAccounts"]>>(
          "GET",
          "/v1/accounts",
        ),
    },
    orders: {
      getOrderChance: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["getOrderChance"]>>(
          "GET",
          "/v1/orders/chance",
          params,
        ),
      createOrder: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["createOrder"]>>(
          "POST",
          "/v1/orders",
          body,
        ),
      createOrdersBatch: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["createOrdersBatch"]>>(
          "POST",
          "/v1/orders/batch",
          body,
        ),
      getOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["getOrder"]>>(
          "GET",
          "/v1/order",
          params,
        ),
      cancelOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["cancelOrder"]>>(
          "DELETE",
          "/v1/order",
          params,
        ),
      cancelOrders: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["cancelOrders"]>>(
          "POST",
          "/v1/orders/cancel",
          body,
        ),
      listOrders: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["listOrders"]>>(
          "GET",
          "/v1/orders",
          params,
        ),
      listTwapOrders: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["listTwapOrders"]>>(
          "GET",
          "/v1/twap",
          params,
        ),
      cancelTwapOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["cancelTwapOrder"]>>(
          "DELETE",
          "/v1/twap",
          params,
        ),
      createTwapOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["createTwapOrder"]>>(
          "POST",
          "/v1/twap",
          params,
        ),
    },
    withdrawals: {
      listWithdraws: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["listWithdraws"]>>(
          "GET",
          "/v1/withdraws",
          params,
        ),
      listWithdrawsKrw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["listWithdrawsKrw"]>>(
          "GET",
          "/v1/withdraws/krw",
          params,
        ),
      getWithdraw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdraw"]>>(
          "GET",
          "/v1/withdraw",
          params,
        ),
      getWithdrawChance: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdrawChance"]>>(
          "GET",
          "/v1/withdraws/chance",
          params,
        ),
      listWithdrawsCoinAddresses: async () =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["listWithdrawsCoinAddresses"]>>(
          "GET",
          "/v1/withdraws/coin_addresses",
        ),
      createWithdrawsCoin: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["createWithdrawsCoin"]>>(
          "POST",
          "/v1/withdraws/coin",
          body,
        ),
      createWithdrawsKrw: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["createWithdrawsKrw"]>>(
          "POST",
          "/v1/withdraws/krw",
          body,
        ),
    },
    deposits: {
      listDeposits: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["listDeposits"]>>(
          "GET",
          "/v1/deposits",
          params,
        ),
      listDepositsKrw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["listDepositsKrw"]>>(
          "GET",
          "/v1/deposits/krw",
          params,
        ),
      getDeposit: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDeposit"]>>(
          "GET",
          "/v1/deposit",
          params,
        ),
      listDepositsCoinAddresses: async () =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["listDepositsCoinAddresses"]>>(
          "GET",
          "/v1/deposits/coin_addresses",
        ),
      getDepositsCoinAddress: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDepositsCoinAddress"]>>(
          "GET",
          "/v1/deposits/coin_address",
          params,
        ),
      createDepositsKrw: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["createDepositsKrw"]>>(
          "POST",
          "/v1/deposits/krw",
          body,
        ),
      createDepositAddress: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["createDepositAddress"]>>(
          "POST",
          "/v1/deposits/generate_coin_address",
          body,
        ),
    },
  };
}
