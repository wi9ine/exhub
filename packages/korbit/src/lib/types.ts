// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import type { ExHubClientOptions } from "@exhub/core";
import type {
  CancelCoinWithdrawal200,
  CancelCoinWithdrawalParams,
  CancelOrder200,
  CancelOrderParams,
  CreateCoinDepositAddress200,
  CreateCoinWithdrawal200,
  CreateOrder200,
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
  RequestKrwWithdrawal200,
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
    listTickers: (
      params?: Omit<ListTickersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListTickers200>;
    getOrderbook: (
      params?: Omit<GetOrderbookParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetOrderbook200>;
    listTrades: (
      params?: Omit<ListTradesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListTrades200>;
    getCandles: (
      params?: Omit<GetCandlesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCandles200>;
    listCurrencyPairs: () => Promise<ListCurrencyPairs200>;
    getTickSizePolicy: (
      params?: Omit<GetTickSizePolicyParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetTickSizePolicy200>;
  };
  service: {
    listCurrencies: () => Promise<ListCurrencies200>;
    getTime: () => Promise<GetTime200>;
    getTradingFeePolicy: (
      params?: Omit<GetTradingFeePolicyParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetTradingFeePolicy200>;
    getCurrentKeyInfo: (
      params?: Omit<GetCurrentKeyInfoParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCurrentKeyInfo200>;
  };
  orders: {
    getOrder: (
      params?: Omit<GetOrderParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetOrder200>;
    createOrder: () => Promise<CreateOrder200>;
    cancelOrder: (
      params?: Omit<CancelOrderParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<CancelOrder200>;
    listOpenOrders: (
      params?: Omit<ListOpenOrdersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListOpenOrders200>;
    listAllOrders: (
      params?: Omit<ListAllOrdersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListAllOrders200>;
    listMyTrades: (
      params?: Omit<ListMyTradesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListMyTrades200>;
  };
  assets: {
    listBalance: (
      params?: Omit<ListBalanceParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListBalance200>;
  };
  cryptoDeposits: {
    listCoinDepositAddresses: (
      params?: Omit<ListCoinDepositAddressesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinDepositAddresses200>;
    getCoinDepositAddress: (
      params?: Omit<GetCoinDepositAddressParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinDepositAddress200>;
    createCoinDepositAddress: () => Promise<CreateCoinDepositAddress200>;
    listCoinRecentDeposits: (
      params?: Omit<ListCoinRecentDepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinRecentDeposits200>;
    getCoinDeposit: (
      params?: Omit<GetCoinDepositParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinDeposit200>;
  };
  cryptoWithdrawals: {
    listCoinWithdrawableAddresses: (
      params?: Omit<ListCoinWithdrawableAddressesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinWithdrawableAddresses200>;
    getCoinWithdrawableAmount: (
      params?: Omit<GetCoinWithdrawableAmountParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinWithdrawableAmount200>;
    createCoinWithdrawal: () => Promise<CreateCoinWithdrawal200>;
    cancelCoinWithdrawal: (
      params?: Omit<CancelCoinWithdrawalParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<CancelCoinWithdrawal200>;
    getCoinWithdrawal: (
      params?: Omit<GetCoinWithdrawalParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<GetCoinWithdrawal200>;
    listCoinRecentWithdrawals: (
      params?: Omit<ListCoinRecentWithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListCoinRecentWithdrawals200>;
  };
  krw: {
    requestKrwDeposit: () => Promise<RequestKrwDeposit200>;
    requestKrwWithdrawal: () => Promise<RequestKrwWithdrawal200>;
    listKrwRecentDeposits: (
      params?: Omit<ListKrwRecentDepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListKrwRecentDeposits200>;
    listKrwRecentWithdrawals: (
      params?: Omit<ListKrwRecentWithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<ListKrwRecentWithdrawals200>;
  };
}
