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

const BITHUMB_DEFAULT_BASE_URL = "https://getApiKeys.bithumb.com";

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
      getMarketAll: async (params) =>
        requestPublic<AsyncResult<BithumbClient["markets"]["getMarketAll"]>>(
          "/v1/market/all",
          params,
        ),
      getMarketVirtualAssetWarning: async () =>
        requestPublic<AsyncResult<BithumbClient["markets"]["getMarketVirtualAssetWarning"]>>(
          "/v1/market/virtual_asset_warning",
        ),
    },
    candles: {
      minute: async (params, unit = 1) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["minute"]>>(
          `/v1/candles/minutes/${unit}`,
          params,
        ),
      day: async (params) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["day"]>>("/v1/candles/days", params),
      week: async (params) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["week"]>>("/v1/candles/weeks", params),
      month: async (params) =>
        requestPublic<AsyncResult<BithumbClient["candles"]["month"]>>("/v1/candles/months", params),
    },
    trades: {
      getTradesTicks: async (params) =>
        requestPublic<AsyncResult<BithumbClient["trades"]["getTradesTicks"]>>(
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
      getNotices: async () =>
        requestPublic<AsyncResult<BithumbClient["service"]["getNotices"]>>("/v1/notices"),
      getFeeInfo: async (currency) =>
        requestPublic<AsyncResult<BithumbClient["service"]["getFeeInfo"]>>(
          `/v2/fee/inout/${currency}`,
        ),
      getStatusWallet: async () =>
        requestPrivate<AsyncResult<BithumbClient["service"]["getStatusWallet"]>>(
          "GET",
          "/v1/status/wallet",
        ),
      getApiKeys: async () =>
        requestPrivate<AsyncResult<BithumbClient["service"]["getApiKeys"]>>("GET", "/v1/api_keys"),
    },
    accounts: {
      getAccounts: async () =>
        requestPrivate<AsyncResult<BithumbClient["accounts"]["getAccounts"]>>(
          "GET",
          "/v1/accounts",
        ),
    },
    orders: {
      getOrdersChance: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["getOrdersChance"]>>(
          "GET",
          "/v1/orders/chance",
          params,
        ),
      placeOrder: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["placeOrder"]>>(
          "POST",
          "/v1/orders",
          body,
        ),
      placeBatchOrders: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["placeBatchOrders"]>>(
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
      getOrders: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["getOrders"]>>(
          "GET",
          "/v1/orders",
          params,
        ),
      getTwapOrders: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["getTwapOrders"]>>(
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
      getWithdraws: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdraws"]>>(
          "GET",
          "/v1/withdraws",
          params,
        ),
      getWithdrawsKrw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdrawsKrw"]>>(
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
      getWithdrawsChance: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdrawsChance"]>>(
          "GET",
          "/v1/withdraws/chance",
          params,
        ),
      getWithdrawsCoinAddresses: async () =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdrawsCoinAddresses"]>>(
          "GET",
          "/v1/withdraws/coin_addresses",
        ),
      withdrawCoin: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["withdrawCoin"]>>(
          "POST",
          "/v1/withdraws/coin",
          body,
        ),
      withdrawKrw: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["withdrawKrw"]>>(
          "POST",
          "/v1/withdraws/krw",
          body,
        ),
    },
    deposits: {
      getDeposits: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDeposits"]>>(
          "GET",
          "/v1/deposits",
          params,
        ),
      getDepositsKrw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDepositsKrw"]>>(
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
      getDepositsCoinAddresses: async () =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDepositsCoinAddresses"]>>(
          "GET",
          "/v1/deposits/coin_addresses",
        ),
      getDepositsCoinAddress: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDepositsCoinAddress"]>>(
          "GET",
          "/v1/deposits/coin_address",
          params,
        ),
      depositKrw: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["depositKrw"]>>(
          "POST",
          "/v1/deposits/krw",
          body,
        ),
      generateCoinAddress: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["generateCoinAddress"]>>(
          "POST",
          "/v1/deposits/generate_coin_address",
          body,
        ),
    },
  };
}
