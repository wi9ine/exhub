// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
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

export interface GopaxClient {
  market: {
    listAssets: () => Promise<ListAssets200Item[]>;
    listTradingPairs: () => Promise<ListTradingPairs200Item[]>;
    getTradingPairPriceTickSize: (
      tradingPair: string,
    ) => Promise<GetTradingPairPriceTickSize200Item[]>;
    getTradingPairTicker: (tradingPair: string) => Promise<GetTradingPairTicker200>;
    getTradingPairBook: (
      tradingPair: string,
      params?: GetTradingPairBookParams,
    ) => Promise<GetTradingPairBook200>;
    listTradingPairTrades: (
      tradingPair: string,
      params?: ListTradingPairTradesParams,
    ) => Promise<ListTradingPairTrades200Item[]>;
    getTradingPairStats: (tradingPair: string) => Promise<GetTradingPairStats200>;
    listTradingPairsStats: () => Promise<ListTradingPairsStats200Item[]>;
    getTradingPairCandles: (
      tradingPair: string,
      params?: GetTradingPairCandlesParams,
    ) => Promise<number[][]>;
    listTradingPairsCautions: (
      params?: ListTradingPairsCautionsParams,
    ) => Promise<ListTradingPairsCautions200Item[]>;
    listTickers: () => Promise<ListTickers200Item[]>;
    getTime: () => Promise<GetTime200>;
    listNotices: (params?: ListNoticesParams) => Promise<string[]>;
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
    getOrderByClientOrderId: (clientOrderID: string) => Promise<GetOrderByClientOrderId200>;
    cancelOrderByClientOrderId: (clientOrderID: string) => Promise<CancelOrderByClientOrderId200>;
  };
  trades: {
    listTrades: (params?: ListTradesParams) => Promise<ListTrades200Item[]>;
  };
  wallet: {
    listDepositWithdrawalStatus: (params?: ListDepositWithdrawalStatusParams) => Promise<string[]>;
    listCryptoDepositAddresses: () => Promise<ListCryptoDepositAddresses200Item[]>;
    listCryptoWithdrawalAddresses: () => Promise<ListCryptoWithdrawalAddresses200Item[]>;
    createWithdrawal: (body: CreateWithdrawalBody) => Promise<void>;
  };
}
