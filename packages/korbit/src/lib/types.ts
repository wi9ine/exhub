import type { ExHubClientOptions } from "@exhub/core";

import type {
  CancelCoinWithdrawal200,
  CancelCoinWithdrawalParams,
  CancelOrder200,
  CancelOrderParams,
  CreateCoinDepositAddress200,
  CreateCoinDepositAddressBody,
  CreateCoinWithdrawal200,
  CreateCoinWithdrawalBody,
  CreateOrder200,
  CreateOrderBody,
  GetCoinDeposit200,
  GetCoinDepositAddress200,
  GetCoinDepositAddressParams,
  GetCoinDepositParams,
  GetCoinWithdrawableAmount200,
  GetCoinWithdrawableAmountParams,
  GetCoinWithdrawal200,
  GetCoinWithdrawalParams,
  GetCurrentKeyInfo200,
  GetCurrentKeyInfoParams,
  GetOrder200,
  GetOrderParams,
  GetTradingFeePolicy200,
  GetTradingFeePolicyParams,
  ListAllOrders200,
  ListAllOrdersParams,
  ListBalance200,
  ListBalanceParams,
  ListCoinDepositAddresses200,
  ListCoinDepositAddressesParams,
  ListCoinRecentDeposits200,
  ListCoinRecentDepositsParams,
  ListCoinRecentWithdrawals200,
  ListCoinRecentWithdrawalsParams,
  ListCoinWithdrawableAddresses200,
  ListCoinWithdrawableAddressesParams,
  ListKrwRecentDeposits200,
  ListKrwRecentDepositsParams,
  ListKrwRecentWithdrawals200,
  ListKrwRecentWithdrawalsParams,
  ListMyTrades200,
  ListMyTradesParams,
  ListOpenOrders200,
  ListOpenOrdersParams,
  RequestKrwDeposit200,
  RequestKrwDepositBody,
  RequestKrwWithdrawal200,
  RequestKrwWithdrawalBody,
} from "../generated/private/model";
import type {
  GetCandles200,
  GetCandlesParams,
  GetOrderbook200,
  GetOrderbookParams,
  GetTickSizePolicy200,
  GetTickSizePolicyParams,
  GetTime200,
  ListCurrencies200,
  ListCurrencyPairs200,
  ListTickers200,
  ListTickersParams,
  ListTrades200,
  ListTradesParams,
} from "../generated/public/model";

export interface KorbitCredentials {
  apiKey: string;
  secretKey: string;
  recvWindow?: number;
}

export type KorbitClientOptions = ExHubClientOptions<KorbitCredentials>;

export type KorbitSignedParamsInput = Record<string, unknown> | undefined;

export interface KorbitClient {
  market: {
    tickers: (params?: ListTickersParams) => Promise<ListTickers200>;
    orderbook: (
      params: Omit<GetOrderbookParams, "level"> & { level?: string },
    ) => Promise<GetOrderbook200>;
    trades: (params: ListTradesParams) => Promise<ListTrades200>;
    candles: (params: GetCandlesParams) => Promise<GetCandles200>;
    currencyPairs: () => Promise<ListCurrencyPairs200>;
    tickSizePolicy: (params: GetTickSizePolicyParams) => Promise<GetTickSizePolicy200>;
    currencies: () => Promise<ListCurrencies200>;
    time: () => Promise<GetTime200>;
  };
  orders: {
    createOrder: (body: CreateOrderBody) => Promise<CreateOrder200>;
    cancelOrder: (
      params: Omit<CancelOrderParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<CancelOrder200>;
    getOrder: (
      params: Omit<GetOrderParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetOrder200>;
    listOpenOrders: (
      params: Omit<ListOpenOrdersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListOpenOrders200>;
    listAllOrders: (
      params: Omit<ListAllOrdersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListAllOrders200>;
    listMyTrades: (
      params: Omit<ListMyTradesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListMyTrades200>;
  };
  assets: {
    listBalance: (
      params?: Omit<ListBalanceParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListBalance200>;
  };
  cryptoDeposits: {
    listDepositAddresses: (
      params?: Omit<ListCoinDepositAddressesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinDepositAddresses200>;
    createDepositAddress: (
      body: CreateCoinDepositAddressBody,
    ) => Promise<CreateCoinDepositAddress200>;
    getDepositAddress: (
      params: Omit<GetCoinDepositAddressParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinDepositAddress200>;
    listRecentDeposits: (
      params: Omit<ListCoinRecentDepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinRecentDeposits200>;
    getDeposit: (
      params: Omit<GetCoinDepositParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinDeposit200>;
  };
  cryptoWithdrawals: {
    listWithdrawableAddresses: (
      params?: Omit<ListCoinWithdrawableAddressesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinWithdrawableAddresses200>;
    getWithdrawableAmount: (
      params?: Omit<GetCoinWithdrawableAmountParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinWithdrawableAmount200>;
    createWithdrawal: (body: CreateCoinWithdrawalBody) => Promise<CreateCoinWithdrawal200>;
    cancelWithdrawal: (
      params: Omit<CancelCoinWithdrawalParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<CancelCoinWithdrawal200>;
    listRecentWithdrawals: (
      params: Omit<ListCoinRecentWithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinRecentWithdrawals200>;
    getWithdrawal: (
      params: Omit<GetCoinWithdrawalParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinWithdrawal200>;
  };
  krw: {
    requestDepositPush: (body: RequestKrwDepositBody) => Promise<RequestKrwDeposit200>;
    requestWithdrawalPush: (body: RequestKrwWithdrawalBody) => Promise<RequestKrwWithdrawal200>;
    listRecentDeposits: (
      params: Omit<ListKrwRecentDepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListKrwRecentDeposits200>;
    listRecentWithdrawals: (
      params: Omit<ListKrwRecentWithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListKrwRecentWithdrawals200>;
  };
  service: {
    getTradingFeePolicy: (
      params?: Omit<GetTradingFeePolicyParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetTradingFeePolicy200>;
    getCurrentKeyInfo: (
      params?: Omit<GetCurrentKeyInfoParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCurrentKeyInfo200>;
  };
}
