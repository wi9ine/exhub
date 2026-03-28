// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createRequestFunctions } from "./auth";
import type { GopaxClient, GopaxClientOptions } from "./types";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

export function createGopaxClient(options: GopaxClientOptions = {}): GopaxClient {
  const { requestPublic, requestPrivate } = createRequestFunctions(options);

  return {
    market: {
      listAssets: async () =>
        requestPublic<AsyncResult<GopaxClient["market"]["listAssets"]>>("/assets"),
      listTradingPairs: async () =>
        requestPublic<AsyncResult<GopaxClient["market"]["listTradingPairs"]>>("/trading-pairs"),
      getTradingPairPriceTickSize: async (tradingPair) =>
        requestPublic<AsyncResult<GopaxClient["market"]["getTradingPairPriceTickSize"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/price-tick-size`,
        ),
      getTradingPairTicker: async (tradingPair) =>
        requestPublic<AsyncResult<GopaxClient["market"]["getTradingPairTicker"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/ticker`,
        ),
      getTradingPairBook: async (tradingPair, params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["getTradingPairBook"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/book`,
          params,
        ),
      listTradingPairTrades: async (tradingPair, params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["listTradingPairTrades"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/trades`,
          params,
        ),
      getTradingPairStats: async (tradingPair) =>
        requestPublic<AsyncResult<GopaxClient["market"]["getTradingPairStats"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/stats`,
        ),
      listTradingPairsStats: async () =>
        requestPublic<AsyncResult<GopaxClient["market"]["listTradingPairsStats"]>>(
          "/trading-pairs/stats",
        ),
      getTradingPairCandles: async (tradingPair, params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["getTradingPairCandles"]>>(
          `/trading-pairs/${encodePathSegment(tradingPair)}/candles`,
          params,
        ),
      listTradingPairsCautions: async (params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["listTradingPairsCautions"]>>(
          "/trading-pairs/cautions",
          params,
        ),
      listTickers: async () =>
        requestPublic<AsyncResult<GopaxClient["market"]["listTickers"]>>("/tickers"),
      getTime: async () => requestPublic<AsyncResult<GopaxClient["market"]["getTime"]>>("/time"),
      listNotices: async (params) =>
        requestPublic<AsyncResult<GopaxClient["market"]["listNotices"]>>("/notices", params),
    },
    account: {
      listBalances: async () =>
        requestPrivate<AsyncResult<GopaxClient["account"]["listBalances"]>>({
          method: "GET",
          path: "/balances",
        }),
      getBalance: async (assetName) =>
        requestPrivate<AsyncResult<GopaxClient["account"]["getBalance"]>>({
          method: "GET",
          path: `/balances/${encodePathSegment(assetName)}`,
        }),
    },
    orders: {
      listOrders: async (params) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["listOrders"]>>({
          method: "GET",
          path: "/orders",
          query: params,
        }),
      createOrder: async (body) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["createOrder"]>>({
          method: "POST",
          path: "/orders",
          body,
        }),
      getOrder: async (orderId) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["getOrder"]>>({
          method: "GET",
          path: `/orders/${encodePathSegment(orderId)}`,
        }),
      cancelOrder: async (orderId) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["cancelOrder"]>>({
          method: "DELETE",
          path: `/orders/${encodePathSegment(orderId)}`,
        }),
      getOrderByClientOrderId: async (clientOrderID) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["getOrderByClientOrderId"]>>({
          method: "GET",
          path: `/orders/clientOrderId/${encodePathSegment(clientOrderID)}`,
        }),
      cancelOrderByClientOrderId: async (clientOrderID) =>
        requestPrivate<AsyncResult<GopaxClient["orders"]["cancelOrderByClientOrderId"]>>({
          method: "DELETE",
          path: `/orders/clientOrderId/${encodePathSegment(clientOrderID)}`,
        }),
    },
    trades: {
      listTrades: async (params) =>
        requestPrivate<AsyncResult<GopaxClient["trades"]["listTrades"]>>({
          method: "GET",
          path: "/trades",
          query: params,
        }),
    },
    wallet: {
      listDepositWithdrawalStatus: async (params) =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["listDepositWithdrawalStatus"]>>({
          method: "GET",
          path: "/deposit-withdrawal-status",
          query: params,
        }),
      listCryptoDepositAddresses: async () =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["listCryptoDepositAddresses"]>>({
          method: "GET",
          path: "/crypto-deposit-addresses",
        }),
      listCryptoWithdrawalAddresses: async () =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["listCryptoWithdrawalAddresses"]>>({
          method: "GET",
          path: "/crypto-withdrawal-addresses",
        }),
      createWithdrawal: async (body) =>
        requestPrivate<AsyncResult<GopaxClient["wallet"]["createWithdrawal"]>>({
          method: "POST",
          path: "/withdrawals",
          body,
        }),
    },
  };
}
