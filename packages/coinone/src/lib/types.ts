import type { ExHubClientOptions } from "@exhub/core";
import { createNonce, ExHubConfigurationError, resolveBaseUrl, sha512Hex } from "@exhub/core";

import type {
  CancelOrder200,
  CancelOrderBody,
  CancelOrders200,
  CancelOrdersBody,
  CreateCoinWithdrawal200,
  CreateCoinWithdrawalBody,
  CreateLimitOrder200,
  CreateLimitOrderBody,
  CreateOrder200,
  CreateOrderBody,
  GetCoinTransactionHistoryDetail200,
  GetCoinTransactionHistoryDetailBody,
  GetCoinWithdrawalLimit200,
  GetCoinWithdrawalLimitBody,
  GetOrderDetail200,
  GetOrderDetailBody,
  GetOrderInfo200,
  GetOrderInfoBody,
  GetTradeFeeByPair200,
  GetTradeFeeByPairBody,
  ListActiveOrders200,
  ListActiveOrdersBody,
  ListBalance200,
  ListBalanceByCurrencies200,
  ListBalanceByCurrenciesBody,
  ListCoinTransactionHistory200,
  ListCoinTransactionHistoryBody,
  ListCoinWithdrawalAddressBook200,
  ListCoinWithdrawalAddressBookBody,
  ListCompletedOrders200,
  ListCompletedOrdersAll200,
  ListCompletedOrdersAllBody,
  ListCompletedOrdersBody,
  ListKrwTransactionHistory200,
  ListKrwTransactionHistoryBody,
  ListOpenOrders200,
  ListOpenOrdersAll200,
  ListOpenOrdersAllBody,
  ListOpenOrdersBody,
  ListOrderRewardHistory200,
  ListOrderRewardHistoryBody,
  ListOrderRewardPrograms200,
  ListOrderRewardProgramsBody,
  ListTradeFees200,
} from "../generated/private/model";
import type {
  GetChart200,
  GetChartParams,
  GetCurrency200,
  GetMarket200,
  GetOrderbook200,
  GetOrderbookDeprecated200,
  GetOrderbookDeprecatedParams,
  GetOrderbookParams,
  GetRangeUnit200,
  GetTicker200,
  GetTickerDeprecated200,
  GetTickerDeprecatedParams,
  GetTickerParams,
  GetTickerUtc200,
  GetTickerUtcDeprecated200,
  GetTickerUtcDeprecatedParams,
  GetTickerUtcParams,
  ListCurrencies200,
  ListMarkets200,
  ListTickers200,
  ListTickersParams,
  ListTickerUtc200,
  ListTickerUtcParams,
  ListTrades200,
  ListTradesDeprecated200,
  ListTradesDeprecatedParams,
  ListTradesParams,
} from "../generated/public/model";

export interface CoinoneCredentials {
  accessToken: string;
  secretKey: string;
}

export type CoinoneClientOptions = ExHubClientOptions<CoinoneCredentials>;

export type CreateCoinoneSignedBodyInput = Record<string, unknown> | undefined;

export interface CoinoneClient {
  market: {
    getRangeUnit: (quoteCurrency?: string, targetCurrency?: string) => Promise<GetRangeUnit200>;
    listMarkets: (quoteCurrency?: string) => Promise<ListMarkets200>;
    getMarket: (quoteCurrency?: string, targetCurrency?: string) => Promise<GetMarket200>;
    getOrderbook: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: GetOrderbookParams,
    ) => Promise<GetOrderbook200>;
    listTrades: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: ListTradesParams,
    ) => Promise<ListTrades200>;
    listTickers: (quoteCurrency?: string, params?: ListTickersParams) => Promise<ListTickers200>;
    getTicker: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: GetTickerParams,
    ) => Promise<GetTicker200>;
    listTickerUtc: (
      quoteCurrency?: string,
      params?: ListTickerUtcParams,
    ) => Promise<ListTickerUtc200>;
    getTickerUtc: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: GetTickerUtcParams,
    ) => Promise<GetTickerUtc200>;
    listCurrencies: () => Promise<ListCurrencies200>;
    getCurrency: (currency?: string) => Promise<GetCurrency200>;
    getChart: (
      quoteCurrency: string | undefined,
      targetCurrency: string | undefined,
      params: GetChartParams,
    ) => Promise<GetChart200>;
    getOrderbookDeprecated: (
      params?: GetOrderbookDeprecatedParams,
    ) => Promise<GetOrderbookDeprecated200>;
    getTickerDeprecated: (params?: GetTickerDeprecatedParams) => Promise<GetTickerDeprecated200>;
    getTickerUtcDeprecated: (
      params?: GetTickerUtcDeprecatedParams,
    ) => Promise<GetTickerUtcDeprecated200>;
    listTradesDeprecated: (params?: ListTradesDeprecatedParams) => Promise<ListTradesDeprecated200>;
  };
  account: {
    listBalance: () => Promise<ListBalance200>;
    listBalanceByCurrencies: (
      body: Omit<ListBalanceByCurrenciesBody, "access_token" | "nonce">,
    ) => Promise<ListBalanceByCurrencies200>;
    listTradeFees: () => Promise<ListTradeFees200>;
    getTradeFeeByPair: (
      quoteCurrency?: string,
      targetCurrency?: string,
      body?: Omit<GetTradeFeeByPairBody, "access_token" | "nonce">,
    ) => Promise<GetTradeFeeByPair200>;
  };
  orders: {
    listActiveOrders: (
      body?: Omit<ListActiveOrdersBody, "access_token" | "nonce">,
    ) => Promise<ListActiveOrders200>;
    createOrder: (body: Omit<CreateOrderBody, "access_token" | "nonce">) => Promise<CreateOrder200>;
    createLimitOrder: (
      body: Omit<CreateLimitOrderBody, "access_token" | "nonce">,
    ) => Promise<CreateLimitOrder200>;
    cancelOrders: (
      body: Omit<CancelOrdersBody, "access_token" | "nonce">,
    ) => Promise<CancelOrders200>;
    cancelOrder: (body: Omit<CancelOrderBody, "access_token" | "nonce">) => Promise<CancelOrder200>;
    getOrderDetail: (
      body: Omit<GetOrderDetailBody, "access_token" | "nonce">,
    ) => Promise<GetOrderDetail200>;
    listCompletedOrdersAll: (
      body: Omit<ListCompletedOrdersAllBody, "access_token" | "nonce">,
    ) => Promise<ListCompletedOrdersAll200>;
    listCompletedOrders: (
      body: Omit<ListCompletedOrdersBody, "access_token" | "nonce">,
    ) => Promise<ListCompletedOrders200>;
    listOpenOrdersAll: (
      body?: Omit<ListOpenOrdersAllBody, "access_token" | "nonce">,
    ) => Promise<ListOpenOrdersAll200>;
    listOpenOrders: (
      body: Omit<ListOpenOrdersBody, "access_token" | "nonce">,
    ) => Promise<ListOpenOrders200>;
    getOrderInfo: (
      body: Omit<GetOrderInfoBody, "access_token" | "nonce">,
    ) => Promise<GetOrderInfo200>;
  };
  transactions: {
    listKrwTransactionHistory: (
      body?: Omit<ListKrwTransactionHistoryBody, "access_token" | "nonce">,
    ) => Promise<ListKrwTransactionHistory200>;
    listCoinTransactionHistory: (
      body?: Omit<ListCoinTransactionHistoryBody, "access_token" | "nonce">,
    ) => Promise<ListCoinTransactionHistory200>;
    getCoinTransactionHistoryDetail: (
      body: Omit<GetCoinTransactionHistoryDetailBody, "access_token" | "nonce">,
    ) => Promise<GetCoinTransactionHistoryDetail200>;
    getCoinWithdrawalLimit: (
      body: Omit<GetCoinWithdrawalLimitBody, "access_token" | "nonce">,
    ) => Promise<GetCoinWithdrawalLimit200>;
    listCoinWithdrawalAddressBook: (
      body?: Omit<ListCoinWithdrawalAddressBookBody, "access_token" | "nonce">,
    ) => Promise<ListCoinWithdrawalAddressBook200>;
    createCoinWithdrawal: (
      body: Omit<CreateCoinWithdrawalBody, "access_token" | "nonce">,
    ) => Promise<CreateCoinWithdrawal200>;
  };
  rewards: {
    listOrderRewardPrograms: (
      body?: Omit<ListOrderRewardProgramsBody, "access_token" | "nonce">,
    ) => Promise<ListOrderRewardPrograms200>;
    listOrderRewardHistory: (
      body?: Omit<ListOrderRewardHistoryBody, "access_token" | "nonce">,
    ) => Promise<ListOrderRewardHistory200>;
  };
}

export const COINONE_DEFAULT_BASE_URL = "https://api.coinone.co.kr";

export function createCoinoneSignedBody<TBody extends CreateCoinoneSignedBodyInput>(
  credentials: CoinoneCredentials,
  body?: TBody,
) {
  return {
    access_token: credentials.accessToken,
    nonce: createNonce(),
    ...(body ?? {}),
  };
}

export function createCoinoneHeaders(
  credentials: CoinoneCredentials,
  payload: Record<string, unknown>,
) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
  return {
    headers: {
      "Content-Type": "application/json",
      "X-COINONE-PAYLOAD": encodedPayload,
      "X-COINONE-SIGNATURE": sha512Hex(encodedPayload, credentials.secretKey),
    },
  };
}

export function resolveCoinoneCredentials(
  options: CoinoneClientOptions,
): Promise<CoinoneCredentials> | CoinoneCredentials {
  if (options.credentialsProvider) return options.credentialsProvider();
  if (options.credentials) return options.credentials;
  throw new ExHubConfigurationError("Coinone 인증 정보가 설정되지 않았습니다.");
}

export function resolveCoinoneBaseUrl(options: CoinoneClientOptions): string {
  return resolveBaseUrl(COINONE_DEFAULT_BASE_URL, options.baseURL);
}
