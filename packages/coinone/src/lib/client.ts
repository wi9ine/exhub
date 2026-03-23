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
      rangeUnit: async (quoteCurrency = "KRW", targetCurrency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["rangeUnit"]>>(
          `/public/v2/range_units/${quoteCurrency}/${targetCurrency}`,
        ),
      markets: async (quoteCurrency = "KRW") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["markets"]>>(
          `/public/v2/markets/${quoteCurrency}`,
        ),
      market: async (quoteCurrency = "KRW", targetCurrency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["market"]>>(
          `/public/v2/markets/${quoteCurrency}/${targetCurrency}`,
        ),
      orderbook: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["orderbook"]>>(
          `/public/v2/orderbook/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      recentCompletedOrders: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["recentCompletedOrders"]>>(
          `/public/v2/trades/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      tickers: async (quoteCurrency = "KRW", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["tickers"]>>(
          `/public/v2/ticker_new/${quoteCurrency}`,
          params,
        ),
      ticker: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["ticker"]>>(
          `/public/v2/ticker_new/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      utcTickers: async (quoteCurrency = "KRW", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["utcTickers"]>>(
          `/public/v2/ticker_utc_new/${quoteCurrency}`,
          params,
        ),
      utcTicker: async (quoteCurrency = "KRW", targetCurrency = "BTC", params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["utcTicker"]>>(
          `/public/v2/ticker_utc_new/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      currencies: async () =>
        requestPublic<AsyncResult<CoinoneClient["market"]["currencies"]>>("/public/v2/currencies"),
      currency: async (currency = "BTC") =>
        requestPublic<AsyncResult<CoinoneClient["market"]["currency"]>>(
          `/public/v2/currencies/${currency}`,
        ),
      chart: async (quoteCurrency, targetCurrency, params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["chart"]>>(
          `/public/v2/chart/${quoteCurrency}/${targetCurrency}`,
          params,
        ),
      orderbookDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["orderbookDeprecated"]>>(
          "/orderbook",
          params,
        ),
      tickerDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["tickerDeprecated"]>>("/ticker", params),
      tickerUtcDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["tickerUtcDeprecated"]>>(
          "/ticker_utc",
          params,
        ),
      recentCompletedOrdersDeprecated: async (params) =>
        requestPublic<AsyncResult<CoinoneClient["market"]["recentCompletedOrdersDeprecated"]>>(
          "/trades",
          params,
        ),
    },
    account: {
      findBalance: async () =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["findBalance"]>>(
          "/v2.1/account/balance/all",
        ),
      findBalanceByCurrencies: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["findBalanceByCurrencies"]>>(
          "/v2.1/account/balance",
          body,
        ),
      findAllTradeFees: async () =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["findAllTradeFees"]>>(
          "/v2.1/account/trade_fee",
        ),
      findTradeFeeByPair: async (quoteCurrency = "KRW", targetCurrency = "BTC", body = {}) =>
        requestPrivate<AsyncResult<CoinoneClient["account"]["findTradeFeeByPair"]>>(
          `/v2.1/account/trade_fee/${quoteCurrency}/${targetCurrency}`,
          body,
        ),
    },
    orders: {
      findActiveOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["findActiveOrders"]>>(
          "/v2.1/order/active_orders",
          body,
        ),
      orderDetail: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["orderDetail"]>>(
          "/v2.1/order/detail",
          body,
        ),
      findAllCompletedOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["findAllCompletedOrders"]>>(
          "/v2.1/order/completed_orders/all",
          body,
        ),
      findCompletedOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["findCompletedOrders"]>>(
          "/v2.1/order/completed_orders",
          body,
        ),
      findAllOpenOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["findAllOpenOrders"]>>(
          "/v2.1/order/open_orders/all",
          body,
        ),
      findOpenOrders: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["findOpenOrders"]>>(
          "/v2.1/order/open_orders",
          body,
        ),
      findOrderInfo: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["orders"]["findOrderInfo"]>>(
          "/v2.1/order/info",
          body,
        ),
    },
    transactions: {
      krwTransactionHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["krwTransactionHistory"]>>(
          "/v2.1/transaction/krw/history",
          body,
        ),
      coinTransactionHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["coinTransactionHistory"]>>(
          "/v2.1/transaction/coin/history",
          body,
        ),
      singleCoinTransactionHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["singleCoinTransactionHistory"]>>(
          "/v2.1/transaction/coin/history/detail",
          body,
        ),
      coinWithdrawalLimit: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["coinWithdrawalLimit"]>>(
          "/v2.1/transaction/coin/withdrawal/limit",
          body,
        ),
      coinWithdrawalAddressBook: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["transactions"]["coinWithdrawalAddressBook"]>>(
          "/v2.1/transaction/coin/withdrawal/address_book",
          body,
        ),
    },
    rewards: {
      orderRewardPrograms: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["rewards"]["orderRewardPrograms"]>>(
          "/v2.1/event/order-reward/programs",
          body,
        ),
      orderRewardHistory: async (body) =>
        requestPrivate<AsyncResult<CoinoneClient["rewards"]["orderRewardHistory"]>>(
          "/v2.1/event/order-reward/history",
          body,
        ),
    },
  };
}
