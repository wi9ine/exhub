import type { AxiosRequestConfig } from "axios";

import * as privateApi from "../generated/private";
import * as publicApi from "../generated/public";
import type { CoinoneClient, CoinoneClientOptions, CreateCoinoneSignedBodyInput } from "./types";
import {
  createCoinoneHeaders,
  createCoinoneSignedBody,
  resolveCoinoneBaseUrl,
  resolveCoinoneCredentials,
} from "./types";

function createPublicRequestConfig(baseURL: string, timeout: number): AxiosRequestConfig {
  return {
    baseURL,
    timeout,
  };
}

async function createPrivateRequestContext(
  options: CoinoneClientOptions,
  baseURL: string,
  timeout: number,
): Promise<{
  requestBody: {
    access_token: string;
    nonce: string;
  };
  requestConfig: AxiosRequestConfig;
}>;
async function createPrivateRequestContext<TInput extends Record<string, unknown>>(
  options: CoinoneClientOptions,
  baseURL: string,
  timeout: number,
  body: TInput,
): Promise<{
  requestBody: TInput & {
    access_token: string;
    nonce: string;
  };
  requestConfig: AxiosRequestConfig;
}>;
async function createPrivateRequestContext(
  options: CoinoneClientOptions,
  baseURL: string,
  timeout: number,
  body?: CreateCoinoneSignedBodyInput,
) {
  const credentials = await resolveCoinoneCredentials(options);
  const requestBody = body
    ? createCoinoneSignedBody(credentials, body)
    : createCoinoneSignedBody(credentials);
  const signed = createCoinoneHeaders(credentials, requestBody);

  return {
    requestBody,
    requestConfig: {
      baseURL,
      timeout,
      headers: signed.headers,
    } satisfies AxiosRequestConfig,
  };
}

export function createCoinoneClient(options: CoinoneClientOptions = {}): CoinoneClient {
  const baseURL = resolveCoinoneBaseUrl(options);
  const timeout = options.timeout ?? 10_000;

  return {
    market: {
      rangeUnit: async (quoteCurrency, targetCurrency) =>
        (
          await publicApi.rangeUnit(
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      markets: async (quoteCurrency) =>
        (await publicApi.markets(quoteCurrency, createPublicRequestConfig(baseURL, timeout))).data,
      market: async (quoteCurrency, targetCurrency) =>
        (
          await publicApi.market(
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      orderbook: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.orderbook(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      recentCompletedOrders: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.recentCompletedOrders(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      tickers: async (quoteCurrency, params) =>
        (
          await publicApi.tickers(
            params,
            quoteCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      ticker: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.ticker(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      utcTickers: async (quoteCurrency, params) =>
        (
          await publicApi.utcTickers(
            params,
            quoteCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      utcTicker: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.utcTicker(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      currencies: async () =>
        (await publicApi.currencies(createPublicRequestConfig(baseURL, timeout))).data,
      currency: async (currency) =>
        (await publicApi.currency(currency, createPublicRequestConfig(baseURL, timeout))).data,
      chart: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.chart(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
      orderbookDeprecated: async (params) =>
        (await publicApi.orderbookDeprecated(params, createPublicRequestConfig(baseURL, timeout)))
          .data,
      tickerDeprecated: async (params) =>
        (await publicApi.ticker1(params, createPublicRequestConfig(baseURL, timeout))).data,
      tickerUtcDeprecated: async (params) =>
        (await publicApi.tickerUtcDeprecated(params, createPublicRequestConfig(baseURL, timeout)))
          .data,
      recentCompletedOrdersDeprecated: async (params) =>
        (
          await publicApi.recentCompleteOrdersDeprecated(
            params,
            createPublicRequestConfig(baseURL, timeout),
          )
        ).data,
    },
    account: {
      findBalance: async () => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
        );
        return (await privateApi.findBalance(requestBody, requestConfig)).data;
      },
      findBalanceByCurrencies: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.findBalanceByCurrencies(requestBody, requestConfig)).data;
      },
      findAllTradeFees: async () => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
        );
        return (await privateApi.findAllTradeFees(requestBody, requestConfig)).data;
      },
      findTradeFeeByPair: async (quoteCurrency = "KRW", targetCurrency = "BTC", body = {}) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (
          await privateApi.findTradeFeeByPair(
            requestBody,
            quoteCurrency,
            targetCurrency,
            requestConfig,
          )
        ).data;
      },
    },
    orders: {
      findActiveOrders: async (body) => {
        const { requestBody, requestConfig } = body
          ? await createPrivateRequestContext(options, baseURL, timeout, body)
          : await createPrivateRequestContext(options, baseURL, timeout);
        return (await privateApi.findActiveOrders(requestBody, requestConfig)).data;
      },
      orderDetail: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.orderDetail(requestBody, requestConfig)).data;
      },
      findAllCompletedOrders: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.findAllCompletedOrders(requestBody, requestConfig)).data;
      },
      findCompletedOrders: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.findCompletedOrders(requestBody, requestConfig)).data;
      },
      findAllOpenOrders: async (body) => {
        const { requestBody, requestConfig } = body
          ? await createPrivateRequestContext(options, baseURL, timeout, body)
          : await createPrivateRequestContext(options, baseURL, timeout);
        return (await privateApi.findAllOpenOrders(requestBody, requestConfig)).data;
      },
      findOpenOrders: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.findOpenOrders(requestBody, requestConfig)).data;
      },
      findOrderInfo: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.findOrderInfo(requestBody, requestConfig)).data;
      },
    },
    transactions: {
      krwTransactionHistory: async (body) => {
        const { requestBody, requestConfig } = body
          ? await createPrivateRequestContext(options, baseURL, timeout, body)
          : await createPrivateRequestContext(options, baseURL, timeout);
        return (await privateApi.krwTransactionHistory(requestBody, requestConfig)).data;
      },
      coinTransactionHistory: async (body) => {
        const { requestBody, requestConfig } = body
          ? await createPrivateRequestContext(options, baseURL, timeout, body)
          : await createPrivateRequestContext(options, baseURL, timeout);
        return (await privateApi.coinTransactionHistory(requestBody, requestConfig)).data;
      },
      singleCoinTransactionHistory: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.singleCoinTransactionHistory(requestBody, requestConfig)).data;
      },
      coinWithdrawalLimit: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext(
          options,
          baseURL,
          timeout,
          body,
        );
        return (await privateApi.coinWithdrawalLimit(requestBody, requestConfig)).data;
      },
      coinWithdrawalAddressBook: async (body) => {
        const { requestBody, requestConfig } = body
          ? await createPrivateRequestContext(options, baseURL, timeout, body)
          : await createPrivateRequestContext(options, baseURL, timeout);
        return (await privateApi.coinWithdrawalAddressBook(requestBody, requestConfig)).data;
      },
    },
    rewards: {
      orderRewardPrograms: async (body) => {
        const { requestBody, requestConfig } = body
          ? await createPrivateRequestContext(options, baseURL, timeout, body)
          : await createPrivateRequestContext(options, baseURL, timeout);
        return (await privateApi.orderRewardPrograms(requestBody, requestConfig)).data;
      },
      orderRewardHistory: async (body) => {
        const { requestBody, requestConfig } = body
          ? await createPrivateRequestContext(options, baseURL, timeout, body)
          : await createPrivateRequestContext(options, baseURL, timeout);
        return (await privateApi.orderRewardHistory(requestBody, requestConfig)).data;
      },
    },
  };
}
