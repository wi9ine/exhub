// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createRequestFunctions } from "./auth";
import type { BithumbClient, BithumbClientOptions } from "./types";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

export function createBithumbClient(options: BithumbClientOptions = {}): BithumbClient {
  const { requestPublic, requestPrivate } = createRequestFunctions(options);

  return {
    markets: {
      getMarkets: async (params) =>
        requestPublic<AsyncResult<BithumbClient["markets"]["getMarkets"]>>(
          "/v1/market/all",
          params,
        ),
    },
    candles: {
      getMinuteCandles: async (unit = 1, params) =>
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
      getMarketVirtualAssetWarning: async () =>
        requestPublic<AsyncResult<BithumbClient["service"]["getMarketVirtualAssetWarning"]>>(
          "/v1/market/virtual_asset_warning",
        ),
      listNotices: async () =>
        requestPublic<AsyncResult<BithumbClient["service"]["listNotices"]>>("/v1/notices"),
      getFeeInfo: async (currency) =>
        requestPublic<AsyncResult<BithumbClient["service"]["getFeeInfo"]>>(
          `/v2/fee/inout/${encodePathSegment(currency)}`,
        ),
      getWalletStatus: async () =>
        requestPrivate<AsyncResult<BithumbClient["service"]["getWalletStatus"]>>({
          method: "GET",
          path: "/v1/status/wallet",
        }),
      listApiKeys: async () =>
        requestPrivate<AsyncResult<BithumbClient["service"]["listApiKeys"]>>({
          method: "GET",
          path: "/v1/api_keys",
        }),
    },
    accounts: {
      listAccounts: async () =>
        requestPrivate<AsyncResult<BithumbClient["accounts"]["listAccounts"]>>({
          method: "GET",
          path: "/v1/accounts",
        }),
    },
    orders: {
      getOrderChance: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["getOrderChance"]>>({
          method: "GET",
          path: "/v1/orders/chance",
          query: params,
        }),
      getOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["getOrder"]>>({
          method: "GET",
          path: "/v1/order",
          query: params,
        }),
      cancelOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["cancelOrder"]>>({
          method: "DELETE",
          path: "/v1/order",
          query: params,
        }),
      listOrders: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["listOrders"]>>({
          method: "GET",
          path: "/v1/orders",
          query: params,
        }),
      createOrder: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["createOrder"]>>({
          method: "POST",
          path: "/v1/orders",
          body,
        }),
      createOrdersBatch: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["createOrdersBatch"]>>({
          method: "POST",
          path: "/v1/orders/batch",
          body,
        }),
      cancelOrders: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["cancelOrders"]>>({
          method: "POST",
          path: "/v1/orders/cancel",
          body,
        }),
      listTwapOrders: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["listTwapOrders"]>>({
          method: "GET",
          path: "/v1/twap",
          query: params,
        }),
      cancelTwapOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["cancelTwapOrder"]>>({
          method: "DELETE",
          path: "/v1/twap",
          query: params,
        }),
      createTwapOrder: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["orders"]["createTwapOrder"]>>({
          method: "POST",
          path: "/v1/twap",
          query: params,
        }),
    },
    withdrawals: {
      listWithdraws: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["listWithdraws"]>>({
          method: "GET",
          path: "/v1/withdraws",
          query: params,
        }),
      listWithdrawsKrw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["listWithdrawsKrw"]>>({
          method: "GET",
          path: "/v1/withdraws/krw",
          query: params,
        }),
      createWithdrawsKrw: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["createWithdrawsKrw"]>>({
          method: "POST",
          path: "/v1/withdraws/krw",
          body,
        }),
      getWithdraw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdraw"]>>({
          method: "GET",
          path: "/v1/withdraw",
          query: params,
        }),
      getWithdrawChance: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["getWithdrawChance"]>>({
          method: "GET",
          path: "/v1/withdraws/chance",
          query: params,
        }),
      createWithdrawsCoin: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["createWithdrawsCoin"]>>({
          method: "POST",
          path: "/v1/withdraws/coin",
          body,
        }),
      listWithdrawsCoinAddresses: async () =>
        requestPrivate<AsyncResult<BithumbClient["withdrawals"]["listWithdrawsCoinAddresses"]>>({
          method: "GET",
          path: "/v1/withdraws/coin_addresses",
        }),
    },
    deposits: {
      listDeposits: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["listDeposits"]>>({
          method: "GET",
          path: "/v1/deposits",
          query: params,
        }),
      listDepositsKrw: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["listDepositsKrw"]>>({
          method: "GET",
          path: "/v1/deposits/krw",
          query: params,
        }),
      createDepositsKrw: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["createDepositsKrw"]>>({
          method: "POST",
          path: "/v1/deposits/krw",
          body,
        }),
      getDeposit: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDeposit"]>>({
          method: "GET",
          path: "/v1/deposit",
          query: params,
        }),
      createDepositAddress: async (body) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["createDepositAddress"]>>({
          method: "POST",
          path: "/v1/deposits/generate_coin_address",
          body,
        }),
      listDepositsCoinAddresses: async () =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["listDepositsCoinAddresses"]>>({
          method: "GET",
          path: "/v1/deposits/coin_addresses",
        }),
      getDepositsCoinAddress: async (params) =>
        requestPrivate<AsyncResult<BithumbClient["deposits"]["getDepositsCoinAddress"]>>({
          method: "GET",
          path: "/v1/deposits/coin_address",
          query: params,
        }),
    },
  };
}
