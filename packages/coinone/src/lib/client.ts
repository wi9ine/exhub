import { defaultHttpTransport } from "@exhub/core";

import type { CoinoneClient, CoinoneClientOptions, CreateCoinoneSignedBodyInput } from "./types";
import {
  createCoinoneHeaders,
  createCoinoneSignedBody,
  resolveCoinoneBaseUrl,
  resolveCoinoneCredentials,
} from "./types";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

export function createCoinoneClient(options: CoinoneClientOptions = {}): CoinoneClient {
  const transport = defaultHttpTransport;
  const baseURL = resolveCoinoneBaseUrl(options);
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
    body?: CreateCoinoneSignedBodyInput,
  ): Promise<TResponse> {
    const credentials = await resolveCoinoneCredentials(options);
    const requestBody = body
      ? createCoinoneSignedBody(credentials, body)
      : createCoinoneSignedBody(credentials);
    const signed = createCoinoneHeaders(credentials, requestBody);

    return transport.request<TResponse>({
      method: "POST",
      baseURL,
      path,
      body: requestBody,
      timeout,
      headers: signed.headers,
    });
  }

  return {
    market: {
      getRangeUnit: async (quoteCurrency = "KRW", targetCurrency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getRangeUnit"]>>(
          `/public/v2/range_units/${quoteCurrency}/${targetCurrency}`,
        ),
      listMarkets: async (quoteCurrency = "KRW") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listMarkets"]>>(
          `/public/v2/markets/${quoteCurrency}`,
        ),
      getMarket: async (quoteCurrency = "KRW", targetCurrency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getMarket"]>>(
          `/public/v2/markets/${quoteCurrency}/${targetCurrency}`,
        ),
      getOrderbook: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getOrderbook"]>>(
          `/public/v2/orderbook/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      listTrades: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listTrades"]>>(
          `/public/v2/trades/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      listTickers: async (quoteCurrency = "KRW", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listTickers"]>>(
          `/public/v2/ticker_new/${quoteCurrency}`,
          params,
        ),
      getTicker: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getTicker"]>>(
          `/public/v2/ticker_new/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      listTickerUtc: async (quoteCurrency = "KRW", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listTickerUtc"]>>(
          `/public/v2/ticker_utc_new/${quoteCurrency}`,
          params,
        ),
      getTickerUtc: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getTickerUtc"]>>(
          `/public/v2/ticker_utc_new/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      listCurrencies: async () =>
        requestPublic<AsyncResult<CoinoneClient["market"]["listCurrencies"]>>("/public/v2/currencies"),
      getCurrency: async (currency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getCurrency"]>>(
          `/public/v2/currencies/${currency}`,
        ),
      getChart: async (quoteCurrency, targetCurrency, params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getChart"]>>(
          `/public/v2/chart/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      getOrderbookDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getOrderbookDeprecated"]>>(
          "/orderbook",
          params,
        ),
      getTickerDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["getTickerDeprecated"]>>("/ticker", params),
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
      listBalance: async () =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["listBalance"]>>(
          "/v2.1/account/balance/all",
        ),
      listBalanceByCurrencies: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["listBalanceByCurrencies"]>>(
          "/v2.1/account/balance",
          body,
        ),
      listTradeFees: async () =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["listTradeFees"]>>(
          "/v2.1/account/trade_fee",
        ),
      getTradeFeeByPair: async (quoteCurrency = "KRW", targetCurrency = "BTC", body = {}) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["getTradeFeeByPair"]>>(
          `/v2.1/account/trade_fee/${quoteCurrency}/${targetCurrency}`,
          body,
        ),
    },
    orders: {
      listActiveOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listActiveOrders"]>>(
          "/v2.1/order/active_orders",
          body,
        ),
      createOrder: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["createOrder"]>>("/v2.1/order", body),
      createLimitOrder: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["createLimitOrder"]>>(
          "/v2.1/order/limit",
          body,
        ),
      cancelOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["cancelOrders"]>>(
          "/v2.1/order/cancel/all",
          body,
        ),
      cancelOrder: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["cancelOrder"]>>(
          "/v2.1/order/cancel",
          body,
        ),
      getOrderDetail: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["getOrderDetail"]>>(
          "/v2.1/order/detail",
          body,
        ),
      listCompletedOrdersAll: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listCompletedOrdersAll"]>>(
          "/v2.1/order/completed_orders/all",
          body,
        ),
      listCompletedOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listCompletedOrders"]>>(
          "/v2.1/order/completed_orders",
          body,
        ),
      listOpenOrdersAll: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listOpenOrdersAll"]>>(
          "/v2.1/order/open_orders/all",
          body,
        ),
      listOpenOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["listOpenOrders"]>>(
          "/v2.1/order/open_orders",
          body,
        ),
      getOrderInfo: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["getOrderInfo"]>>(
          "/v2.1/order/info",
          body,
        ),
    },
    transactions: {
      listKrwTransactionHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["listKrwTransactionHistory"]>>(
          "/v2.1/transaction/krw/history",
          body,
        ),
      listCoinTransactionHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["listCoinTransactionHistory"]>>(
          "/v2.1/transaction/coin/history",
          body,
        ),
      getCoinTransactionHistoryDetail: async (body) =>
        requestPrivate<
          AsyncResult<CoinoneClient["transactions"]["getCoinTransactionHistoryDetail"]>
        >(
          "/v2.1/transaction/coin/history/detail",
          body,
        ),
      getCoinWithdrawalLimit: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["getCoinWithdrawalLimit"]>>(
          "/v2.1/transaction/coin/withdrawal/limit",
          body,
        ),
      listCoinWithdrawalAddressBook: async (body) =>
        requestPrivate<
          AsyncResult<CoinoneClient["transactions"]["listCoinWithdrawalAddressBook"]>
        >(
          "/v2.1/transaction/coin/withdrawal/address_book",
          body,
        ),
      createCoinWithdrawal: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["createCoinWithdrawal"]>>(
          "/v2.1/transaction/coin/withdrawal",
          body,
        ),
    },
    rewards: {
      listOrderRewardPrograms: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["rewards"]["listOrderRewardPrograms"]>>(
          "/v2.1/event/order-reward/programs",
          body,
        ),
      listOrderRewardHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["rewards"]["listOrderRewardHistory"]>>(
          "/v2.1/event/order-reward/history",
          body,
        ),
    },
  };
}
