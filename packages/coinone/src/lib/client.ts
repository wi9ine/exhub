import type { AxiosRequestConfig } from "axios";

import * as privateApi from "../generated/private";
import type {
  CoinTransactionHistoryBody,
  CoinWithdrawalAddressBookBody,
  CoinWithdrawalLimitBody,
  FindActiveOrdersBody,
  FindAllCompletedOrdersBody,
  FindAllOpenOrdersBody,
  FindAllTradeFeesBody,
  FindBalanceBody,
  FindBalanceByCurrenciesBody,
  FindCompletedOrdersBody,
  FindOpenOrdersBody,
  FindOrderInfoBody,
  FindTradeFeeByPairBody,
  KrwTransactionHistoryBody,
  OrderDetailBody,
  OrderRewardHistoryBody,
  OrderRewardProgramsBody,
  SingleCoinTransactionHistoryBody,
} from "../generated/private/model";
import * as publicApi from "../generated/public";
import type {
  CoinoneClient,
  CoinoneClientOptions,
  CoinoneCredentials,
  CreateCoinoneSignedBodyInput,
} from "./types";
import {
  createCoinoneHeaders,
  createCoinoneSignedBody,
  resolveCoinoneBaseUrl,
  resolveCoinoneCredentials,
} from "./types";

function createPublicRequestConfig(options: CoinoneClientOptions): AxiosRequestConfig {
  return {
    baseURL: resolveCoinoneBaseUrl(options),
    timeout: options.timeout ?? 10_000,
  };
}

async function createPrivateRequestContext<
  TSignedBody extends Record<string, unknown>,
  TInput extends CreateCoinoneSignedBodyInput = undefined,
>(options: CoinoneClientOptions, body?: TInput) {
  const credentials = (await resolveCoinoneCredentials(options)) as CoinoneCredentials;
  const requestBody = createCoinoneSignedBody(credentials, body) as unknown as TSignedBody;
  const signed = createCoinoneHeaders(credentials, requestBody);

  return {
    requestBody,
    requestConfig: {
      baseURL: resolveCoinoneBaseUrl(options),
      timeout: options.timeout ?? 10_000,
      headers: signed.headers,
    } satisfies AxiosRequestConfig,
  };
}

export function createCoinoneClient(options: CoinoneClientOptions = {}): CoinoneClient {
  return {
    market: {
      rangeUnit: async (quoteCurrency, targetCurrency) =>
        (
          await publicApi.rangeUnit(
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(options),
          )
        ).data,
      markets: async (quoteCurrency) =>
        (await publicApi.markets(quoteCurrency, createPublicRequestConfig(options))).data,
      market: async (quoteCurrency, targetCurrency) =>
        (await publicApi.market(quoteCurrency, targetCurrency, createPublicRequestConfig(options)))
          .data,
      orderbook: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.orderbook(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(options),
          )
        ).data,
      recentCompletedOrders: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.recentCompletedOrders(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(options),
          )
        ).data,
      tickers: async (quoteCurrency, params) =>
        (await publicApi.tickers(params, quoteCurrency, createPublicRequestConfig(options))).data,
      ticker: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.ticker(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(options),
          )
        ).data,
      utcTickers: async (quoteCurrency, params) =>
        (await publicApi.utcTickers(params, quoteCurrency, createPublicRequestConfig(options)))
          .data,
      utcTicker: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.utcTicker(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(options),
          )
        ).data,
      currencies: async () => (await publicApi.currencies(createPublicRequestConfig(options))).data,
      currency: async (currency) =>
        (await publicApi.currency(currency, createPublicRequestConfig(options))).data,
      chart: async (quoteCurrency, targetCurrency, params) =>
        (
          await publicApi.chart(
            params,
            quoteCurrency,
            targetCurrency,
            createPublicRequestConfig(options),
          )
        ).data,
      orderbookDeprecated: async (params) =>
        (await publicApi.orderbookDeprecated(params, createPublicRequestConfig(options))).data,
      tickerDeprecated: async (params) =>
        (await publicApi.ticker1(params, createPublicRequestConfig(options))).data,
      tickerUtcDeprecated: async (params) =>
        (await publicApi.tickerUtcDeprecated(params, createPublicRequestConfig(options))).data,
      recentCompletedOrdersDeprecated: async (params) =>
        (await publicApi.recentCompleteOrdersDeprecated(params, createPublicRequestConfig(options)))
          .data,
    },
    account: {
      findBalance: async () => {
        const { requestBody, requestConfig } =
          await createPrivateRequestContext<FindBalanceBody>(options);
        return (await privateApi.findBalance(requestBody, requestConfig)).data;
      },
      findBalanceByCurrencies: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindBalanceByCurrenciesBody,
          typeof body
        >(options, body);
        return (await privateApi.findBalanceByCurrencies(requestBody, requestConfig)).data;
      },
      findAllTradeFees: async () => {
        const { requestBody, requestConfig } =
          await createPrivateRequestContext<FindAllTradeFeesBody>(options);
        return (await privateApi.findAllTradeFees(requestBody, requestConfig)).data;
      },
      findTradeFeeByPair: async (quoteCurrency = "KRW", targetCurrency = "BTC", body = {}) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindTradeFeeByPairBody,
          typeof body
        >(options, body);
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
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindActiveOrdersBody,
          typeof body
        >(options, body);
        return (await privateApi.findActiveOrders(requestBody, requestConfig)).data;
      },
      orderDetail: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          OrderDetailBody,
          typeof body
        >(options, body);
        return (await privateApi.orderDetail(requestBody, requestConfig)).data;
      },
      findAllCompletedOrders: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindAllCompletedOrdersBody,
          typeof body
        >(options, body);
        return (await privateApi.findAllCompletedOrders(requestBody, requestConfig)).data;
      },
      findCompletedOrders: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindCompletedOrdersBody,
          typeof body
        >(options, body);
        return (await privateApi.findCompletedOrders(requestBody, requestConfig)).data;
      },
      findAllOpenOrders: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindAllOpenOrdersBody,
          typeof body
        >(options, body);
        return (await privateApi.findAllOpenOrders(requestBody, requestConfig)).data;
      },
      findOpenOrders: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindOpenOrdersBody,
          typeof body
        >(options, body);
        return (await privateApi.findOpenOrders(requestBody, requestConfig)).data;
      },
      findOrderInfo: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          FindOrderInfoBody,
          typeof body
        >(options, body);
        return (await privateApi.findOrderInfo(requestBody, requestConfig)).data;
      },
    },
    transactions: {
      krwTransactionHistory: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          KrwTransactionHistoryBody,
          typeof body
        >(options, body);
        return (await privateApi.krwTransactionHistory(requestBody, requestConfig)).data;
      },
      coinTransactionHistory: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          CoinTransactionHistoryBody,
          typeof body
        >(options, body);
        return (await privateApi.coinTransactionHistory(requestBody, requestConfig)).data;
      },
      singleCoinTransactionHistory: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          SingleCoinTransactionHistoryBody,
          typeof body
        >(options, body);
        return (await privateApi.singleCoinTransactionHistory(requestBody, requestConfig)).data;
      },
      coinWithdrawalLimit: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          CoinWithdrawalLimitBody,
          typeof body
        >(options, body);
        return (await privateApi.coinWithdrawalLimit(requestBody, requestConfig)).data;
      },
      coinWithdrawalAddressBook: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          CoinWithdrawalAddressBookBody,
          typeof body
        >(options, body);
        return (await privateApi.coinWithdrawalAddressBook(requestBody, requestConfig)).data;
      },
    },
    rewards: {
      orderRewardPrograms: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          OrderRewardProgramsBody,
          typeof body
        >(options, body);
        return (await privateApi.orderRewardPrograms(requestBody, requestConfig)).data;
      },
      orderRewardHistory: async (body) => {
        const { requestBody, requestConfig } = await createPrivateRequestContext<
          OrderRewardHistoryBody,
          typeof body
        >(options, body);
        return (await privateApi.orderRewardHistory(requestBody, requestConfig)).data;
      },
    },
  };
}
