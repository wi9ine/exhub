import type { ExHubClientOptions } from "@exhub/core";
import type {
  CancelOrder200,
  CancelOrderParams,
  CancelOrders200,
  CancelOrdersBody,
  CancelTwapOrder200Item,
  CancelTwapOrderParams,
  CreateDepositAddress201,
  CreateDepositAddressBody,
  CreateDepositsKrw201,
  CreateDepositsKrwBody,
  CreateOrder201,
  CreateOrderBody,
  CreateOrdersBatch200,
  CreateOrdersBatchBody,
  CreateTwapOrder200Item,
  CreateTwapOrderParams,
  CreateWithdrawsCoin201,
  CreateWithdrawsCoinBody,
  CreateWithdrawsKrw201,
  CreateWithdrawsKrwBody,
  GetDeposit200,
  GetDepositParams,
  GetDepositsCoinAddress200,
  GetDepositsCoinAddressParams,
  GetOrder200,
  GetOrderChance200,
  GetOrderChanceParams,
  GetOrderParams,
  GetWalletStatus200Item,
  GetWithdraw200,
  GetWithdrawChance200,
  GetWithdrawChanceParams,
  GetWithdrawParams,
  ListAccounts200Item,
  ListApiKeys200Item,
  ListDeposits200Item,
  ListDepositsCoinAddresses200Item,
  ListDepositsKrw200Item,
  ListDepositsKrwParams,
  ListDepositsParams,
  ListOrders200Item,
  ListOrdersParams,
  ListTwapOrders200Item,
  ListTwapOrdersParams,
  ListWithdraws200Item,
  ListWithdrawsCoinAddresses200Item,
  ListWithdrawsKrw200Item,
  ListWithdrawsKrwParams,
  ListWithdrawsParams,
} from "../generated/private/model";
import type {
  GetDayCandles200Item,
  GetDayCandlesParams,
  GetFeeInfo200Item,
  GetMarkets200Item,
  GetMarketsParams,
  GetMarketVirtualAssetWarning200Item,
  GetMinuteCandles200Item,
  GetMinuteCandlesParams,
  GetMonthCandles200Item,
  GetMonthCandlesParams,
  GetOrderbook200Item,
  GetOrderbookParams,
  GetTicker200Item,
  GetTickerParams,
  GetWeekCandles200Item,
  GetWeekCandlesParams,
  ListNotices200Item,
  ListTradesTicks200Item,
  ListTradesTicksParams,
} from "../generated/public/model";

export interface BithumbCredentials {
  apiKey: string;
  secretKey: string;
}

export type BithumbClientOptions = ExHubClientOptions<BithumbCredentials>;

export interface BithumbClient {
  markets: {
    getMarkets: (params?: GetMarketsParams) => Promise<GetMarkets200Item[]>;
    getMarketVirtualAssetWarning: () => Promise<GetMarketVirtualAssetWarning200Item[]>;
  };
  candles: {
    getMinuteCandles: (
      params: GetMinuteCandlesParams,
      unit?: number,
    ) => Promise<GetMinuteCandles200Item[]>;
    getDayCandles: (params: GetDayCandlesParams) => Promise<GetDayCandles200Item[]>;
    getWeekCandles: (params: GetWeekCandlesParams) => Promise<GetWeekCandles200Item[]>;
    getMonthCandles: (params: GetMonthCandlesParams) => Promise<GetMonthCandles200Item[]>;
  };
  trades: {
    listTradesTicks: (params: ListTradesTicksParams) => Promise<ListTradesTicks200Item[]>;
  };
  tickers: {
    getTicker: (params: GetTickerParams) => Promise<GetTicker200Item[]>;
  };
  orderbook: {
    getOrderbook: (params: GetOrderbookParams) => Promise<GetOrderbook200Item[]>;
  };
  service: {
    listNotices: () => Promise<ListNotices200Item[]>;
    getFeeInfo: (currency: string) => Promise<GetFeeInfo200Item[]>;
    getWalletStatus: () => Promise<GetWalletStatus200Item[]>;
    listApiKeys: () => Promise<ListApiKeys200Item[]>;
  };
  accounts: {
    listAccounts: () => Promise<ListAccounts200Item[]>;
  };
  orders: {
    getOrderChance: (params: GetOrderChanceParams) => Promise<GetOrderChance200>;
    createOrder: (body: CreateOrderBody) => Promise<CreateOrder201>;
    createOrdersBatch: (body: CreateOrdersBatchBody) => Promise<CreateOrdersBatch200>;
    getOrder: (params?: GetOrderParams) => Promise<GetOrder200>;
    cancelOrder: (params?: CancelOrderParams) => Promise<CancelOrder200>;
    cancelOrders: (body: CancelOrdersBody) => Promise<CancelOrders200>;
    listOrders: (params?: ListOrdersParams) => Promise<ListOrders200Item[]>;
    listTwapOrders: (params?: ListTwapOrdersParams) => Promise<ListTwapOrders200Item[]>;
    cancelTwapOrder: (params: CancelTwapOrderParams) => Promise<CancelTwapOrder200Item[]>;
    createTwapOrder: (params: CreateTwapOrderParams) => Promise<CreateTwapOrder200Item[]>;
  };
  withdrawals: {
    listWithdraws: (params?: ListWithdrawsParams) => Promise<ListWithdraws200Item[]>;
    listWithdrawsKrw: (params?: ListWithdrawsKrwParams) => Promise<ListWithdrawsKrw200Item[]>;
    getWithdraw: (params: GetWithdrawParams) => Promise<GetWithdraw200>;
    getWithdrawChance: (params: GetWithdrawChanceParams) => Promise<GetWithdrawChance200>;
    listWithdrawsCoinAddresses: () => Promise<ListWithdrawsCoinAddresses200Item[]>;
    createWithdrawsCoin: (body: CreateWithdrawsCoinBody) => Promise<CreateWithdrawsCoin201>;
    createWithdrawsKrw: (body: CreateWithdrawsKrwBody) => Promise<CreateWithdrawsKrw201>;
  };
  deposits: {
    listDeposits: (params?: ListDepositsParams) => Promise<ListDeposits200Item[]>;
    listDepositsKrw: (params?: ListDepositsKrwParams) => Promise<ListDepositsKrw200Item[]>;
    getDeposit: (params: GetDepositParams) => Promise<GetDeposit200>;
    listDepositsCoinAddresses: () => Promise<ListDepositsCoinAddresses200Item[]>;
    getDepositsCoinAddress: (
      params: GetDepositsCoinAddressParams,
    ) => Promise<GetDepositsCoinAddress200>;
    createDepositsKrw: (body: CreateDepositsKrwBody) => Promise<CreateDepositsKrw201>;
    createDepositAddress: (body: CreateDepositAddressBody) => Promise<CreateDepositAddress201>;
  };
}
