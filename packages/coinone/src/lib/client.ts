// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createRequestFunctions } from "./auth";
import type { CoinoneClient, CoinoneClientOptions } from "./types";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

export function createCoinoneClient(options: CoinoneClientOptions = {}): CoinoneClient {
  const { requestPublic, requestPrivate } = createRequestFunctions(options);

  return {
    market: {
      getRangeUnit: async (quoteCurrency = "KRW", targetCurrency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getRangeUnit"]>>(
          `/public/v2/range_units/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
        ),
      listMarkets: async (quoteCurrency = "KRW") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listMarkets"]>>(
          `/public/v2/markets/${encodePathSegment(quoteCurrency)}`,
        ),
      getMarket: async (quoteCurrency = "KRW", targetCurrency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getMarket"]>>(
          `/public/v2/markets/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
        ),
      getOrderbook: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getOrderbook"]>>(
          `/public/v2/orderbook/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
          params,
        ),
      listTrades: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listTrades"]>>(
          `/public/v2/trades/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
          params,
        ),
      listTickers: async (quoteCurrency = "KRW", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listTickers"]>>(
          `/public/v2/ticker_new/${encodePathSegment(quoteCurrency)}`,
          params,
        ),
      getTicker: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getTicker"]>>(
          `/public/v2/ticker_new/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
          params,
        ),
      listTickerUtc: async (quoteCurrency = "KRW", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listTickerUtc"]>>(
          `/public/v2/ticker_utc_new/${encodePathSegment(quoteCurrency)}`,
          params,
        ),
      getTickerUtc: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getTickerUtc"]>>(
          `/public/v2/ticker_utc_new/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
          params,
        ),
      listCurrencies: async () =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listCurrencies"]>>(
          "/public/v2/currencies",
        ),
      getCurrency: async (currency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getCurrency"]>>(
          `/public/v2/currencies/${encodePathSegment(currency)}`,
        ),
      getChart: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getChart"]>>(
          `/public/v2/chart/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
          params,
        ),
      getOrderbookDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getOrderbookDeprecated"]>>(
          "/orderbook",
          params,
        ),
      getTickerDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getTickerDeprecated"]>>(
          "/ticker",
          params,
        ),
      getTickerUtcDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getTickerUtcDeprecated"]>>(
          "/ticker_utc",
          params,
        ),
      listTradesDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listTradesDeprecated"]>>(
          "/trades",
          params,
        ),
    },
    account: {
      listBalance: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["listBalance"]>>({
          method: "POST",
          path: "/v2.1/account/balance/all",
          body,
        }),
      listBalanceByCurrencies: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["listBalanceByCurrencies"]>>({
          method: "POST",
          path: "/v2.1/account/balance",
          body,
        }),
      listTradeFees: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["listTradeFees"]>>({
          method: "POST",
          path: "/v2.1/account/trade_fee",
          body,
        }),
      getTradeFeeByPair: async (quoteCurrency = "KRW", targetCurrency = "BTC", body) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["getTradeFeeByPair"]>>({
          method: "POST",
          path: `/v2.1/account/trade_fee/${encodePathSegment(quoteCurrency)}/${encodePathSegment(targetCurrency)}`,
          body,
        }),
    },
    orders: {
      listActiveOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listActiveOrders"]>>({
          method: "POST",
          path: "/v2.1/order/active_orders",
          body,
        }),
      getOrderDetail: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["getOrderDetail"]>>({
          method: "POST",
          path: "/v2.1/order/detail",
          body,
        }),
      listCompletedOrdersAll: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listCompletedOrdersAll"]>>({
          method: "POST",
          path: "/v2.1/order/completed_orders/all",
          body,
        }),
      listCompletedOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listCompletedOrders"]>>({
          method: "POST",
          path: "/v2.1/order/completed_orders",
          body,
        }),
      listOpenOrdersAll: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listOpenOrdersAll"]>>({
          method: "POST",
          path: "/v2.1/order/open_orders/all",
          body,
        }),
      listOpenOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listOpenOrders"]>>({
          method: "POST",
          path: "/v2.1/order/open_orders",
          body,
        }),
      getOrderInfo: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["getOrderInfo"]>>({
          method: "POST",
          path: "/v2.1/order/info",
          body,
        }),
      createOrder: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["createOrder"]>>({
          method: "POST",
          path: "/v2.1/order",
          body,
        }),
      cancelOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["cancelOrders"]>>({
          method: "POST",
          path: "/v2.1/order/cancel/all",
          body,
        }),
      cancelOrder: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["cancelOrder"]>>({
          method: "POST",
          path: "/v2.1/order/cancel",
          body,
        }),
      createLimitOrder: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["createLimitOrder"]>>({
          method: "POST",
          path: "/v2.1/order/limit",
          body,
        }),
    },
    transactions: {
      listKrwTransactionHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["listKrwTransactionHistory"]>>({
          method: "POST",
          path: "/v2.1/transaction/krw/history",
          body,
        }),
      listCoinTransactionHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["listCoinTransactionHistory"]>>({
          method: "POST",
          path: "/v2.1/transaction/coin/history",
          body,
        }),
      getCoinTransactionHistoryDetail: async (body) =>
        requestPrivate<
          AsyncResult<CoinoneClient["transactions"]["getCoinTransactionHistoryDetail"]>
        >({ method: "POST", path: "/v2.1/transaction/coin/history/detail", body }),
      getCoinWithdrawalLimit: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["getCoinWithdrawalLimit"]>>({
          method: "POST",
          path: "/v2.1/transaction/coin/withdrawal/limit",
          body,
        }),
      listCoinWithdrawalAddressBook: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["listCoinWithdrawalAddressBook"]>>(
          { method: "POST", path: "/v2.1/transaction/coin/withdrawal/address_book", body },
        ),
      createCoinWithdrawal: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["createCoinWithdrawal"]>>({
          method: "POST",
          path: "/v2.1/transaction/coin/withdrawal",
          body,
        }),
    },
    rewards: {
      listOrderRewardPrograms: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["rewards"]["listOrderRewardPrograms"]>>({
          method: "POST",
          path: "/v2.1/event/order-reward/programs",
          body,
        }),
      listOrderRewardHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["rewards"]["listOrderRewardHistory"]>>({
          method: "POST",
          path: "/v2.1/event/order-reward/history",
          body,
        }),
    },
  };
}
