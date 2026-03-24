import type { ExHubClientOptions } from "@exhub/core";

import type {
  CancelOrder200,
  CancelOrderByClientOrderId200,
  CreateOrder200,
  CreateOrderBody,
  CreateWithdrawalBody,
  GetBalance200,
  GetOrder200,
  GetOrderByClientOrderId200,
  ListBalances200Item,
  ListCryptoDepositAddresses200Item,
  ListCryptoWithdrawalAddresses200Item,
  ListDepositWithdrawalStatusParams,
  ListOrders200Item,
  ListOrdersParams,
  ListTrades200Item,
  ListTradesParams,
} from "../generated/private/model";
import type {
  GetTime200,
  GetTradingPairBook200,
  GetTradingPairBookParams,
  GetTradingPairCandlesParams,
  GetTradingPairPriceTickSize200Item,
  GetTradingPairStats200,
  GetTradingPairTicker200,
  ListAssets200Item,
  ListNoticesParams,
  ListTickers200Item,
  ListTradingPairs200Item,
  ListTradingPairsCautions200Item,
  ListTradingPairsCautionsParams,
  ListTradingPairsStats200Item,
  ListTradingPairTrades200Item,
  ListTradingPairTradesParams,
} from "../generated/public/model";

export interface GopaxCredentials {
  apiKey: string;
  secretKey: string;
  receiveWindow?: number;
}

export type GopaxClientOptions = ExHubClientOptions<GopaxCredentials>;

export type GopaxSignedQueryInput = Record<string, unknown> | undefined;

export interface GopaxClient {
  market: {
    assets: () => Promise<ListAssets200Item[]>;
    tradingPairs: () => Promise<ListTradingPairs200Item[]>;
    priceTickSize: (tradingPair: string) => Promise<GetTradingPairPriceTickSize200Item[]>;
    ticker: (tradingPair: string) => Promise<GetTradingPairTicker200>;
    orderbook: (
      tradingPair: string,
      params?: GetTradingPairBookParams,
    ) => Promise<GetTradingPairBook200>;
    trades: (
      tradingPair: string,
      params?: ListTradingPairTradesParams,
    ) => Promise<ListTradingPairTrades200Item[]>;
    stats: (tradingPair: string) => Promise<GetTradingPairStats200>;
    allStats: () => Promise<ListTradingPairsStats200Item[]>;
    candles: (tradingPair: string, params: GetTradingPairCandlesParams) => Promise<number[][]>;
    cautions: (
      params?: ListTradingPairsCautionsParams,
    ) => Promise<ListTradingPairsCautions200Item[]>;
    tickers: () => Promise<ListTickers200Item[]>;
    time: () => Promise<GetTime200>;
    notices: (params?: ListNoticesParams) => Promise<string[]>;
  };
  account: {
    listBalances: () => Promise<ListBalances200Item[]>;
    getBalance: (assetName: string) => Promise<GetBalance200>;
  };
  orders: {
    listOrders: (params?: ListOrdersParams) => Promise<ListOrders200Item[]>;
    createOrder: (body: CreateOrderBody) => Promise<CreateOrder200>;
    getOrder: (orderId: string) => Promise<GetOrder200>;
    cancelOrder: (orderId: string) => Promise<CancelOrder200>;
    getOrderByClientOrderId: (clientOrderId: string) => Promise<GetOrderByClientOrderId200>;
    cancelOrderByClientOrderId: (clientOrderId: string) => Promise<CancelOrderByClientOrderId200>;
  };
  trades: {
    listTrades: (params?: ListTradesParams) => Promise<ListTrades200Item[]>;
  };
  wallet: {
    listDepositWithdrawalStatus: (params?: ListDepositWithdrawalStatusParams) => Promise<string[]>;
    listCryptoDepositAddresses: () => Promise<ListCryptoDepositAddresses200Item[]>;
    listCryptoWithdrawalAddresses: () => Promise<ListCryptoWithdrawalAddresses200Item[]>;
    withdraw: (body: CreateWithdrawalBody) => Promise<void>;
  };
}
