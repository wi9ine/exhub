import type { ExHubClientOptions } from "@exhub/core";

import type {
  Getv2allorders200,
  Getv2allordersParams,
  Getv2balance200,
  Getv2balanceParams,
  Getv2coindeposit200,
  Getv2coindepositaddress200,
  Getv2coindepositaddresses200,
  Getv2coindepositaddressParams,
  Getv2coindepositParams,
  Getv2coinrecentdeposits200,
  Getv2coinrecentdepositsParams,
  Getv2coinrecentwithdrawals200,
  Getv2coinrecentwithdrawalsParams,
  Getv2coinwithdrawableaddresses200,
  Getv2coinwithdrawableamount200,
  Getv2coinwithdrawableamountParams,
  Getv2coinwithdrawal200,
  Getv2coinwithdrawalParams,
  Getv2currentkeyinfo200,
  Getv2krwrecentdeposits200,
  Getv2krwrecentdepositsParams,
  Getv2krwrecentwithdrawals200,
  Getv2krwrecentwithdrawalsParams,
  Getv2mytrades200,
  Getv2mytradesParams,
  Getv2openorders200,
  Getv2openordersParams,
  Getv2orders200,
  Getv2ordersParams,
  Getv2tradingfeepolicy200,
  Getv2tradingfeepolicyParams,
} from "../generated/private/model";
import type {
  Getv2candles200,
  Getv2candlesParams,
  Getv2currencies200,
  Getv2currencypairs200,
  Getv2orderbook200,
  Getv2orderbookParams,
  Getv2tickers200,
  Getv2tickersParams,
  Getv2ticksizepolicy200,
  Getv2ticksizepolicyParams,
  Getv2time200,
  Getv2trades200,
  Getv2tradesParams,
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
    tickers: (params?: Getv2tickersParams) => Promise<Getv2tickers200>;
    orderbook: (
      params: Omit<Getv2orderbookParams, "level"> & { level?: string },
    ) => Promise<Getv2orderbook200>;
    trades: (params: Getv2tradesParams) => Promise<Getv2trades200>;
    candles: (params: Getv2candlesParams) => Promise<Getv2candles200>;
    currencyPairs: () => Promise<Getv2currencypairs200>;
    tickSizePolicy: (params: Getv2ticksizepolicyParams) => Promise<Getv2ticksizepolicy200>;
    currencies: () => Promise<Getv2currencies200>;
    time: () => Promise<Getv2time200>;
  };
  orders: {
    getOrder: (
      params: Omit<Getv2ordersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2orders200>;
    getOpenOrders: (
      params: Omit<Getv2openordersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2openorders200>;
    getAllOrders: (
      params: Omit<Getv2allordersParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2allorders200>;
    getMyTrades: (
      params: Omit<Getv2mytradesParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2mytrades200>;
  };
  assets: {
    getBalance: (
      params?: Omit<Getv2balanceParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2balance200>;
  };
  cryptoDeposits: {
    getDepositAddresses: () => Promise<Getv2coindepositaddresses200>;
    getDepositAddress: (
      params: Omit<Getv2coindepositaddressParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2coindepositaddress200>;
    getRecentDeposits: (
      params: Omit<Getv2coinrecentdepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2coinrecentdeposits200>;
    getDeposit: (
      params: Omit<Getv2coindepositParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2coindeposit200>;
  };
  cryptoWithdrawals: {
    getWithdrawableAddresses: () => Promise<Getv2coinwithdrawableaddresses200>;
    getWithdrawableAmount: (
      params?: Omit<Getv2coinwithdrawableamountParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2coinwithdrawableamount200>;
    getRecentWithdrawals: (
      params: Omit<Getv2coinrecentwithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2coinrecentwithdrawals200>;
    getWithdrawal: (
      params: Omit<Getv2coinwithdrawalParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2coinwithdrawal200>;
  };
  krw: {
    getRecentDeposits: (
      params: Omit<Getv2krwrecentdepositsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2krwrecentdeposits200>;
    getRecentWithdrawals: (
      params: Omit<Getv2krwrecentwithdrawalsParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2krwrecentwithdrawals200>;
  };
  service: {
    getTradingFeePolicy: (
      params?: Omit<Getv2tradingfeepolicyParams, "timestamp" | "signature" | "recvWindow">,
    ) => Promise<Getv2tradingfeepolicy200>;
    getCurrentKeyInfo: () => Promise<Getv2currentkeyinfo200>;
  };
}
