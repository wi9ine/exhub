import type { ExHubClientOptions } from "@exhub/core";

import type {
  Getbalances200Item,
  Getbalancesassetname200,
  Getcryptodepositaddresses200Item,
  Getcryptowithdrawaladdresses200Item,
  GetdepositwithdrawalstatusParams,
  Getorders200Item,
  Getordersorderid200,
  GetordersParams,
  Gettrades200Item,
  GettradesParams,
} from "../generated/private/model";
import type {
  Getassets200Item,
  GetnoticesParams,
  Gettickers200Item,
  Gettime200,
  Gettradingpairs200Item,
  Gettradingpairscautions200Item,
  GettradingpairscautionsParams,
  Gettradingpairsstats200Item,
  Gettradingpairstradingpairbook200,
  GettradingpairstradingpairbookParams,
  GettradingpairstradingpaircandlesParams,
  Gettradingpairstradingpairpriceticksize200Item,
  Gettradingpairstradingpairstats200,
  Gettradingpairstradingpairticker200,
  Gettradingpairstradingpairtrades200Item,
  GettradingpairstradingpairtradesParams,
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
    assets: () => Promise<Getassets200Item[]>;
    tradingPairs: () => Promise<Gettradingpairs200Item[]>;
    priceTickSize: (
      tradingPair: string,
    ) => Promise<Gettradingpairstradingpairpriceticksize200Item[]>;
    ticker: (tradingPair: string) => Promise<Gettradingpairstradingpairticker200>;
    orderbook: (
      tradingPair: string,
      params?: GettradingpairstradingpairbookParams,
    ) => Promise<Gettradingpairstradingpairbook200>;
    trades: (
      tradingPair: string,
      params?: GettradingpairstradingpairtradesParams,
    ) => Promise<Gettradingpairstradingpairtrades200Item[]>;
    stats: (tradingPair: string) => Promise<Gettradingpairstradingpairstats200>;
    allStats: () => Promise<Gettradingpairsstats200Item[]>;
    candles: (
      tradingPair: string,
      params: GettradingpairstradingpaircandlesParams,
    ) => Promise<number[][]>;
    cautions: (params?: GettradingpairscautionsParams) => Promise<Gettradingpairscautions200Item[]>;
    tickers: () => Promise<Gettickers200Item[]>;
    time: () => Promise<Gettime200>;
    notices: (params?: GetnoticesParams) => Promise<string[]>;
  };
  account: {
    getBalances: () => Promise<Getbalances200Item[]>;
    getBalance: (assetName: string) => Promise<Getbalancesassetname200>;
  };
  orders: {
    getOrders: (params?: GetordersParams) => Promise<Getorders200Item[]>;
    getOrder: (orderId: string) => Promise<Getordersorderid200>;
  };
  trades: {
    getTrades: (params?: GettradesParams) => Promise<Gettrades200Item[]>;
  };
  wallet: {
    getDepositWithdrawalStatus: (params?: GetdepositwithdrawalstatusParams) => Promise<string[]>;
    getCryptoDepositAddresses: () => Promise<Getcryptodepositaddresses200Item[]>;
    getCryptoWithdrawalAddresses: () => Promise<Getcryptowithdrawaladdresses200Item[]>;
  };
}
