import {
  defaultHttpTransport,
  ExHubConfigurationError,
  resolveBaseUrl,
  sha512Base64,
  toQueryString,
} from "@exhub/core";

import type { GopaxClient, GopaxClientOptions, GopaxCredentials } from "./types";

const GOPAX_DEFAULT_BASE_URL = "https://api.gopax.co.kr";
const GOPAX_PRIVATE_PATHS = {
  balances: "/balances",
  orders: "/orders",
  trades: "/trades",
  depositWithdrawalStatus: "/deposit-withdrawal-status",
  cryptoDepositAddresses: "/crypto-deposit-addresses",
  cryptoWithdrawalAddresses: "/crypto-withdrawal-addresses",
} as const;

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
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

export function createGopaxClient(options: GopaxClientOptions = {}): GopaxClient {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(GOPAX_DEFAULT_BASE_URL, options.baseURL);
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
    params?: Record<string, unknown>,
    body?: Record<string, unknown>,
    includeQueryInSignature = false,
  ): Promise<TResponse> {
    const credentials = await resolveCredentials(options);
    const timestamp = String(Date.now());
    const receiveWindow = credentials.receiveWindow;
    const queryString = params ? toQueryString(params) : "";
    const signaturePath = includeQueryInSignature && queryString ? `${path}?${queryString}` : path;
    const bodyString = body ? JSON.stringify(body) : "";
    const message = `t${timestamp}${method}${signaturePath}${receiveWindow ? String(receiveWindow) : ""}${bodyString}`;
    const signature = sha512Base64(message, credentials.secretKey);

    return transport.request<TResponse>({
      method,
      baseURL,
      path,
      query: params,
      body,
      timeout,
      headers: {
        "api-key": credentials.apiKey,
        timestamp,
        signature,
        ...(receiveWindow ? { "receive-window": String(receiveWindow) } : {}),
      },
    });
  }

  return {
    market: {
      assets: async () => requestPublic<AsyncResult<GopaxClient["market"]["assets"]>>("/assets"),
      tradingPairs: async () =>
        requestPublic<AsyncResult<GopaxClient["market"]["tradingPairs"]>>("/trading-pairs"),
      priceTickSize: async (tradingPair) =>
        requestPublic<AsyncResult<GopaxClient["market"]["priceTickSize"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/price-tick-size`,
        ),
      ticker: async (tradingPair) =>
        requestPublic<AsyncResult<GopaxClient["market"]["ticker"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/ticker`,
        ),
      orderbook: async (tradingPair, params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["orderbook"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/book`,
          params,
        ),
      trades: async (tradingPair, params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["trades"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/trades`,
          params,
        ),
      stats: async (tradingPair) =>
        requestPublic<AsyncResult<GopaxClient["market"]["stats"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/stats`,
        ),
      allStats: async () =>
        requestPublic<AsyncResult<GopaxClient["market"]["allStats"]>>("/trading-pairs/stats"),
      candles: async (tradingPair, params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["candles"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/candles`,
          params,
        ),
      cautions: async (params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["cautions"]>>(
          "/trading-pairs/cautions",
          params,
        ),
      tickers: async () => requestPublic<AsyncResult<GopaxClient["market"]["tickers"]>>("/tickers"),
      time: async () => requestPublic<AsyncResult<GopaxClient["market"]["time"]>>("/time"),
      notices: async (params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["notices"]>>("/notices", params),
    },
    account: {
      getBalances: async () =>
        requestPrivate<AsyncResult<GopaxClient["account"]["getBalances"]>>(
          "GET",
          GOPAX_PRIVATE_PATHS.balances,
        ),
      getBalance: async (assetName) => {
        const encodedAssetName = encodePathSegment(assetName);
        return requestPrivate<AsyncResult<GopaxClient["account"]["getBalance"]>>(
          "GET",
          `${GOPAX_PRIVATE_PATHS.balances}/${encodedAssetName}`,
        );
      },
    },
    orders: {
      getOrders: async (params) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["getOrders"]>>(
          "GET",
          GOPAX_PRIVATE_PATHS.orders,
          params,
          undefined,
          true,
        ),
      placeOrder: async (body) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["placeOrder"]>>(
          "POST",
          GOPAX_PRIVATE_PATHS.orders,
          undefined,
          body,
        ),
      getOrder: async (orderId) => {
        const encodedOrderId = encodePathSegment(orderId);
        return requestPrivate<AsyncResult<GopaxClient["orders"]["getOrder"]>>(
          "GET",
          `${GOPAX_PRIVATE_PATHS.orders}/${encodedOrderId}`,
        );
      },
      cancelOrder: async (orderId) => {
        const encodedOrderId = encodePathSegment(orderId);
        return requestPrivate<AsyncResult<GopaxClient["orders"]["cancelOrder"]>>(
          "DELETE",
          `${GOPAX_PRIVATE_PATHS.orders}/${encodedOrderId}`,
        );
      },
      getOrderByClientOrderId: async (clientOrderId) => {
        const encoded = encodePathSegment(clientOrderId);
        return requestPrivate<AsyncResult<GopaxClient["orders"]["getOrderByClientOrderId"]>>(
          "GET",
          `${GOPAX_PRIVATE_PATHS.orders}/clientOrderId/${encoded}`,
        );
      },
      cancelOrderByClientOrderId: async (clientOrderId) => {
        const encoded = encodePathSegment(clientOrderId);
        return requestPrivate<AsyncResult<GopaxClient["orders"]["cancelOrderByClientOrderId"]>>(
          "DELETE",
          `${GOPAX_PRIVATE_PATHS.orders}/clientOrderId/${encoded}`,
        );
      },
    },
    trades: {
      getTrades: async (params) =>
        requestPrivate<AsyncResult<GopaxClient["trades"]["getTrades"]>>(
          "GET",
          GOPAX_PRIVATE_PATHS.trades,
          params,
        ),
    },
    wallet: {
      getDepositWithdrawalStatus: async (params) =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["getDepositWithdrawalStatus"]>>(
          "GET",
          GOPAX_PRIVATE_PATHS.depositWithdrawalStatus,
          params,
        ),
      getCryptoDepositAddresses: async () =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["getCryptoDepositAddresses"]>>(
          "GET",
          GOPAX_PRIVATE_PATHS.cryptoDepositAddresses,
        ),
      getCryptoWithdrawalAddresses: async () =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["getCryptoWithdrawalAddresses"]>>(
          "GET",
          GOPAX_PRIVATE_PATHS.cryptoWithdrawalAddresses,
        ),
      withdraw: async (body) =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["withdraw"]>>(
          "POST",
          "/withdrawals",
          undefined,
          body,
        ),
    },
  };
}
