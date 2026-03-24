import type { ExHubClientOptions } from "@exhub/core";

import type {
  CancelCoinWithdrawal200,
  CancelCoinWithdrawalParams,
  CancelOrder200,
  CancelOrderParams,
  GetAllOrders200,
  GetAllOrdersParams,
  GetBalance200,
  GetBalanceParams,
  GetCoinDeposit200,
  GetCoinDepositAddress200,
  GetCoinDepositAddresses200,
  GetCoinDepositAddressParams,
  GetCoinDepositParams,
  GetCoinRecentDeposits200,
  GetCoinRecentDepositsParams,
  GetCoinRecentWithdrawals200,
  GetCoinRecentWithdrawalsParams,
  GetCoinWithdrawableAddresses200,
  GetCoinWithdrawableAmount200,
  GetCoinWithdrawableAmountParams,
  GetCoinWithdrawal200,
  GetCoinWithdrawalParams,
  GetCurrentKeyInfo200,
  GetKrwRecentDeposits200,
  GetKrwRecentDepositsParams,
  GetKrwRecentWithdrawals200,
  GetKrwRecentWithdrawalsParams,
  GetMyTrades200,
  GetMyTradesParams,
  GetOpenOrders200,
  GetOpenOrdersParams,
  GetOrder200,
  GetOrderParams,
  GetTradingFeePolicy200,
  GetTradingFeePolicyParams,
  CreateCoinDepositAddress200,
  CreateCoinDepositAddressBody,
  CreateCoinWithdrawal200,
  CreateCoinWithdrawalBody,
  RequestKrwDeposit200,
  RequestKrwDepositBody,
  RequestKrwWithdrawal200,
  RequestKrwWithdrawalBody,
  PlaceOrder200,
  PlaceOrderBody,
} from "../generated/private/model";
import type {
  GetCandles200,
  GetCandlesParams,
  GetCurrencies200,
  GetCurrencyPairs200,
  GetOrderbook200,
  GetOrderbookParams,
  GetTickers200,
  GetTickersParams,
  GetTickSizePolicy200,
  GetTickSizePolicyParams,
  GetTime200,
  GetTrades200,
  GetTradesParams,
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
    tickers: (params?: GetTickersParams) => Promise<GetTickers200>;
    orderbook: (
      params: Omit<GetOrderbookParams, "level"> & { level?: string },
    ) => Promise<GetOrderbook200>;
    trades: (params: GetTradesParams) => Promise<GetTrades200>;
    candles: (params: GetCandlesParams) => Promise<GetCandles200>;
    currencyPairs: () => Promise<GetCurrencyPairs200>;
    tickSizePolicy: (params: GetTickSizePolicyParams) => Promise<GetTickSizePolicy200>;
    currencies: () => Promise<GetCurrencies200>;
    time: () => Promise<GetTime200>;
  };
  orders: {
    placeOrder: (body: PlaceOrderBody) => Promise<PlaceOrder200>;
    cancelOrder: (
      params: Omit<CancelOrderParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<CancelOrder200>;
    getOrder: (
      params: Omit<GetOrderParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetOrder200>;
    getOpenOrders: (
      params: Omit<GetOpenOrdersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetOpenOrders200>;
    getAllOrders: (
      params: Omit<GetAllOrdersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetAllOrders200>;
    getMyTrades: (
      params: Omit<GetMyTradesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetMyTrades200>;
  };
  assets: {
    getBalance: (
      params?: Omit<GetBalanceParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetBalance200>;
  };
  cryptoDeposits: {
    getDepositAddresses: () => Promise<GetCoinDepositAddresses200>;
    createDepositAddress: (
      body: CreateCoinDepositAddressBody,
    ) => Promise<CreateCoinDepositAddress200>;
    getDepositAddress: (
      params: Omit<GetCoinDepositAddressParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinDepositAddress200>;
    getRecentDeposits: (
      params: Omit<GetCoinRecentDepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinRecentDeposits200>;
    getDeposit: (
      params: Omit<GetCoinDepositParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinDeposit200>;
  };
  cryptoWithdrawals: {
    getWithdrawableAddresses: () => Promise<GetCoinWithdrawableAddresses200>;
    getWithdrawableAmount: (
      params?: Omit<GetCoinWithdrawableAmountParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinWithdrawableAmount200>;
    withdraw: (body: CreateCoinWithdrawalBody) => Promise<CreateCoinWithdrawal200>;
    cancelWithdrawal: (
      params: Omit<CancelCoinWithdrawalParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<CancelCoinWithdrawal200>;
    getRecentWithdrawals: (
      params: Omit<GetCoinRecentWithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinRecentWithdrawals200>;
    getWithdrawal: (
      params: Omit<GetCoinWithdrawalParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinWithdrawal200>;
  };
  krw: {
    sendDepositPush: (body: RequestKrwDepositBody) => Promise<RequestKrwDeposit200>;
    sendWithdrawalPush: (body: RequestKrwWithdrawalBody) => Promise<RequestKrwWithdrawal200>;
    getRecentDeposits: (
      params: Omit<GetKrwRecentDepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetKrwRecentDeposits200>;
    getRecentWithdrawals: (
      params: Omit<GetKrwRecentWithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetKrwRecentWithdrawals200>;
  };
  service: {
    getTradingFeePolicy: (
      params?: Omit<GetTradingFeePolicyParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetTradingFeePolicy200>;
    getCurrentKeyInfo: () => Promise<GetCurrentKeyInfo200>;
  };
}
