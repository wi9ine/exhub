// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createRequestFunctions } from "./auth";
import type { KorbitClient, KorbitClientOptions } from "./types";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

export function createKorbitClient(options: KorbitClientOptions = {}): KorbitClient {
  const { requestPublic, requestPrivate } = createRequestFunctions(options);

  return {
    market: {
      listTickers: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["listTickers"]>>("/v2/tickers", params),
      getOrderbook: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["getOrderbook"]>>("/v2/orderbook", params),
      listTrades: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["listTrades"]>>("/v2/trades", params),
      getCandles: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["getCandles"]>>("/v2/candles", params),
      listCurrencyPairs: async () =>
        requestPublic<AsyncResult<KorbitClient["market"]["listCurrencyPairs"]>>(
          "/v2/currencyPairs",
        ),
      getTickSizePolicy: async (params) =>
        requestPublic<AsyncResult<KorbitClient["market"]["getTickSizePolicy"]>>(
          "/v2/tickSizePolicy",
          params,
        ),
    },
    service: {
      listCurrencies: async () =>
        requestPublic<AsyncResult<KorbitClient["service"]["listCurrencies"]>>("/v2/currencies"),
      getTime: async () =>
        requestPublic<AsyncResult<KorbitClient["service"]["getTime"]>>("/v2/time"),
      getTradingFeePolicy: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["service"]["getTradingFeePolicy"]>>({
          method: "GET",
          path: "/v2/tradingFeePolicy",
          query: params,
        }),
      getCurrentKeyInfo: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["service"]["getCurrentKeyInfo"]>>({
          method: "GET",
          path: "/v2/currentKeyInfo",
          query: params,
        }),
    },
    orders: {
      getOrder: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["getOrder"]>>({
          method: "GET",
          path: "/v2/orders",
          query: params,
        }),
      createOrder: async () =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["createOrder"]>>({
          method: "POST",
          path: "/v2/orders",
        }),
      cancelOrder: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["cancelOrder"]>>({
          method: "DELETE",
          path: "/v2/orders",
          query: params,
        }),
      listOpenOrders: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["listOpenOrders"]>>({
          method: "GET",
          path: "/v2/openOrders",
          query: params,
        }),
      listAllOrders: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["listAllOrders"]>>({
          method: "GET",
          path: "/v2/allOrders",
          query: params,
        }),
      listMyTrades: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["orders"]["listMyTrades"]>>({
          method: "GET",
          path: "/v2/myTrades",
          query: params,
        }),
    },
    assets: {
      listBalance: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["assets"]["listBalance"]>>({
          method: "GET",
          path: "/v2/balance",
          query: params,
        }),
    },
    cryptoDeposits: {
      listCoinDepositAddresses: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["listCoinDepositAddresses"]>>({
          method: "GET",
          path: "/v2/coin/depositAddresses",
          query: params,
        }),
      getCoinDepositAddress: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getCoinDepositAddress"]>>({
          method: "GET",
          path: "/v2/coin/depositAddress",
          query: params,
        }),
      createCoinDepositAddress: async () =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["createCoinDepositAddress"]>>({
          method: "POST",
          path: "/v2/coin/depositAddress",
        }),
      listCoinRecentDeposits: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["listCoinRecentDeposits"]>>({
          method: "GET",
          path: "/v2/coin/recentDeposits",
          query: params,
        }),
      getCoinDeposit: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoDeposits"]["getCoinDeposit"]>>({
          method: "GET",
          path: "/v2/coin/deposit",
          query: params,
        }),
    },
    cryptoWithdrawals: {
      listCoinWithdrawableAddresses: async (params) =>
        requestPrivate<
          AsyncResult<KorbitClient["cryptoWithdrawals"]["listCoinWithdrawableAddresses"]>
        >({ method: "GET", path: "/v2/coin/withdrawableAddresses", query: params }),
      getCoinWithdrawableAmount: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getCoinWithdrawableAmount"]>>(
          { method: "GET", path: "/v2/coin/withdrawableAmount", query: params },
        ),
      createCoinWithdrawal: async () =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["createCoinWithdrawal"]>>({
          method: "POST",
          path: "/v2/coin/withdrawal",
        }),
      cancelCoinWithdrawal: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["cancelCoinWithdrawal"]>>({
          method: "DELETE",
          path: "/v2/coin/withdrawal",
          query: params,
        }),
      getCoinWithdrawal: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["getCoinWithdrawal"]>>({
          method: "GET",
          path: "/v2/coin/withdrawal",
          query: params,
        }),
      listCoinRecentWithdrawals: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["cryptoWithdrawals"]["listCoinRecentWithdrawals"]>>(
          { method: "GET", path: "/v2/coin/recentWithdrawals", query: params },
        ),
    },
    krw: {
      requestKrwDeposit: async () =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["requestKrwDeposit"]>>({
          method: "POST",
          path: "/v2/krw/sendKrwDepositPush",
        }),
      requestKrwWithdrawal: async () =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["requestKrwWithdrawal"]>>({
          method: "POST",
          path: "/v2/krw/sendKrwWithdrawalPush",
        }),
      listKrwRecentDeposits: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["listKrwRecentDeposits"]>>({
          method: "GET",
          path: "/v2/krw/recentDeposits",
          query: params,
        }),
      listKrwRecentWithdrawals: async (params) =>
        requestPrivate<AsyncResult<KorbitClient["krw"]["listKrwRecentWithdrawals"]>>({
          method: "GET",
          path: "/v2/krw/recentWithdrawals",
          query: params,
        }),
    },
  };
}
