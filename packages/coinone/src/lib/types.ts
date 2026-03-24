import type { ExHubClientOptions } from "@exhub/core";
import { createNonce, ExHubConfigurationError, resolveBaseUrl, sha512Hex } from "@exhub/core";

import type {
  CancelOrder200,
  CancelOrderBody,
  CancelOrders200,
  CancelOrdersBody,
  CoinTransactionHistory200,
  CoinTransactionHistoryBody,
  CoinWithdrawal200,
  CoinWithdrawalAddressBook200,
  CoinWithdrawalAddressBookBody,
  CoinWithdrawalBody,
  CoinWithdrawalLimit200,
  CoinWithdrawalLimitBody,
  FindActiveOrders200,
  FindActiveOrdersBody,
  FindAllCompletedOrders200,
  FindAllCompletedOrdersBody,
  FindAllOpenOrders200,
  FindAllOpenOrdersBody,
  FindAllTradeFees200,
  FindBalance200,
  FindBalanceByCurrencies200,
  FindBalanceByCurrenciesBody,
  FindCompletedOrders200,
  FindCompletedOrdersBody,
  FindOpenOrders200,
  FindOpenOrdersBody,
  FindOrderInfo200,
  FindOrderInfoBody,
  FindTradeFeeByPair200,
  FindTradeFeeByPairBody,
  KrwTransactionHistory200,
  KrwTransactionHistoryBody,
  OrderDetail200,
  OrderDetailBody,
  OrderPlaceLimitOrder200,
  OrderPlaceLimitOrderBody,
  OrderRewardHistory200,
  OrderRewardHistoryBody,
  OrderRewardPrograms200,
  OrderRewardProgramsBody,
  PlaceOrder200,
  PlaceOrderBody,
  SingleCoinTransactionHistory200,
  SingleCoinTransactionHistoryBody,
} from "../generated/private/model";
import type {
  Chart200,
  ChartParams,
  Currencies200,
  Currency200,
  Market200,
  Markets200,
  Orderbook200,
  OrderbookDeprecated200,
  OrderbookDeprecatedParams,
  OrderbookParams,
  RangeUnit200,
  RecentCompletedOrders200,
  RecentCompletedOrdersParams,
  RecentCompletedOrdersDeprecated200,
  RecentCompletedOrdersDeprecatedParams,
  TickerDeprecatedParams,
  Ticker200,
  TickerDeprecated200,
  TickerParams,
  Tickers200,
  TickersParams,
  TickerUtcDeprecated200,
  TickerUtcDeprecatedParams,
  UtcTicker200,
  UtcTickerParams,
  UtcTickers200,
  UtcTickersParams,
} from "../generated/public/model";

export interface CoinoneCredentials {
  accessToken: string;
  secretKey: string;
}

export type CoinoneClientOptions = ExHubClientOptions<CoinoneCredentials>;

export type CreateCoinoneSignedBodyInput = Record<string, unknown> | undefined;

export interface CoinoneClient {
  market: {
    rangeUnit: (quoteCurrency?: string, targetCurrency?: string) => Promise<RangeUnit200>;
    markets: (quoteCurrency?: string) => Promise<Markets200>;
    market: (quoteCurrency?: string, targetCurrency?: string) => Promise<Market200>;
    orderbook: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: OrderbookParams,
    ) => Promise<Orderbook200>;
    recentCompletedOrders: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: RecentCompletedOrdersParams,
    ) => Promise<RecentCompletedOrders200>;
    tickers: (quoteCurrency?: string, params?: TickersParams) => Promise<Tickers200>;
    ticker: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: TickerParams,
    ) => Promise<Ticker200>;
    utcTickers: (quoteCurrency?: string, params?: UtcTickersParams) => Promise<UtcTickers200>;
    utcTicker: (
      quoteCurrency?: string,
      targetCurrency?: string,
      params?: UtcTickerParams,
    ) => Promise<UtcTicker200>;
    currencies: () => Promise<Currencies200>;
    currency: (currency?: string) => Promise<Currency200>;
    chart: (
      quoteCurrency: string | undefined,
      targetCurrency: string | undefined,
      params: ChartParams,
    ) => Promise<Chart200>;
    orderbookDeprecated: (params?: OrderbookDeprecatedParams) => Promise<OrderbookDeprecated200>;
    tickerDeprecated: (params?: TickerDeprecatedParams) => Promise<TickerDeprecated200>;
    tickerUtcDeprecated: (params?: TickerUtcDeprecatedParams) => Promise<TickerUtcDeprecated200>;
    recentCompletedOrdersDeprecated: (
      params?: RecentCompletedOrdersDeprecatedParams,
    ) => Promise<RecentCompletedOrdersDeprecated200>;
  };
  account: {
    findBalance: () => Promise<FindBalance200>;
    findBalanceByCurrencies: (
      body: Omit<FindBalanceByCurrenciesBody, "access_token" | "nonce">,
    ) => Promise<FindBalanceByCurrencies200>;
    findAllTradeFees: () => Promise<FindAllTradeFees200>;
    findTradeFeeByPair: (
      quoteCurrency?: string,
      targetCurrency?: string,
      body?: Omit<FindTradeFeeByPairBody, "access_token" | "nonce">,
    ) => Promise<FindTradeFeeByPair200>;
  };
  orders: {
    findActiveOrders: (
      body?: Omit<FindActiveOrdersBody, "access_token" | "nonce">,
    ) => Promise<FindActiveOrders200>;
    placeOrder: (body: Omit<PlaceOrderBody, "access_token" | "nonce">) => Promise<PlaceOrder200>;
    placeLimitOrder: (
      body: Omit<OrderPlaceLimitOrderBody, "access_token" | "nonce">,
    ) => Promise<OrderPlaceLimitOrder200>;
    cancelOrders: (
      body: Omit<CancelOrdersBody, "access_token" | "nonce">,
    ) => Promise<CancelOrders200>;
    cancelOrder: (body: Omit<CancelOrderBody, "access_token" | "nonce">) => Promise<CancelOrder200>;
    orderDetail: (body: Omit<OrderDetailBody, "access_token" | "nonce">) => Promise<OrderDetail200>;
    findAllCompletedOrders: (
      body: Omit<FindAllCompletedOrdersBody, "access_token" | "nonce">,
    ) => Promise<FindAllCompletedOrders200>;
    findCompletedOrders: (
      body: Omit<FindCompletedOrdersBody, "access_token" | "nonce">,
    ) => Promise<FindCompletedOrders200>;
    findAllOpenOrders: (
      body?: Omit<FindAllOpenOrdersBody, "access_token" | "nonce">,
    ) => Promise<FindAllOpenOrders200>;
    findOpenOrders: (
      body: Omit<FindOpenOrdersBody, "access_token" | "nonce">,
    ) => Promise<FindOpenOrders200>;
    findOrderInfo: (
      body: Omit<FindOrderInfoBody, "access_token" | "nonce">,
    ) => Promise<FindOrderInfo200>;
  };
  transactions: {
    krwTransactionHistory: (
      body?: Omit<KrwTransactionHistoryBody, "access_token" | "nonce">,
    ) => Promise<KrwTransactionHistory200>;
    coinTransactionHistory: (
      body?: Omit<CoinTransactionHistoryBody, "access_token" | "nonce">,
    ) => Promise<CoinTransactionHistory200>;
    singleCoinTransactionHistory: (
      body: Omit<SingleCoinTransactionHistoryBody, "access_token" | "nonce">,
    ) => Promise<SingleCoinTransactionHistory200>;
    coinWithdrawalLimit: (
      body: Omit<CoinWithdrawalLimitBody, "access_token" | "nonce">,
    ) => Promise<CoinWithdrawalLimit200>;
    coinWithdrawalAddressBook: (
      body?: Omit<CoinWithdrawalAddressBookBody, "access_token" | "nonce">,
    ) => Promise<CoinWithdrawalAddressBook200>;
    coinWithdrawal: (
      body: Omit<CoinWithdrawalBody, "access_token" | "nonce">,
    ) => Promise<CoinWithdrawal200>;
  };
  rewards: {
    orderRewardPrograms: (
      body?: Omit<OrderRewardProgramsBody, "access_token" | "nonce">,
    ) => Promise<OrderRewardPrograms200>;
    orderRewardHistory: (
      body?: Omit<OrderRewardHistoryBody, "access_token" | "nonce">,
    ) => Promise<OrderRewardHistory200>;
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
