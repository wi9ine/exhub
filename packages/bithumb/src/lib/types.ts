import type { ExHubClientOptions } from "@exhub/core";
import type {
  Api200Item,
  Canceltwaporder200Item,
  CanceltwaporderParams,
  Createtwaporder200Item,
  CreatetwaporderParams,
  DeleteOrder200,
  DeleteOrderParams,
  GetAccounts200Item,
  GetDeposit200,
  GetDepositParams,
  GetDeposits200Item,
  GetDepositsCoinAddress200,
  GetDepositsCoinAddresses200Item,
  GetDepositsCoinAddressParams,
  GetDepositsKrw200Item,
  GetDepositsKrwParams,
  GetDepositsParams,
  GetOrder200,
  GetOrderParams,
  GetOrders200Item,
  GetOrdersChance200,
  GetOrdersChanceParams,
  GetOrdersParams,
  GetStatusWallet200Item,
  Gettwaporders200Item,
  GettwapordersParams,
  GetWithdraw200,
  GetWithdrawParams,
  GetWithdraws200Item,
  GetWithdrawsChance200,
  GetWithdrawsChanceParams,
  GetWithdrawsCoinAddresses200Item,
  GetWithdrawsKrw200Item,
  GetWithdrawsKrwParams,
  GetWithdrawsParams,
  PostDepositsGenerateCoinAddress201,
  PostDepositsGenerateCoinAddressBody,
  PostDepositsKrw201,
  PostDepositsKrwBody,
  PostOrders201,
  PostOrdersBatch200,
  PostOrdersBatchBody,
  PostOrdersBody,
  PostOrdersCancel200,
  PostOrdersCancelBody,
  PostWithdrawsCoin201,
  PostWithdrawsCoinBody,
  PostWithdrawsKrw201,
  PostWithdrawsKrwBody,
} from "../generated/private/model";
import type {
  Day200Item,
  DayParams,
  GetFeeInfo200Item,
  GetMarketAll200Item,
  GetMarketAllParams,
  GetMarketVirtualAssetWarning200Item,
  GetNotices200Item,
  GetOrderbook200Item,
  GetOrderbookParams,
  GetTicker200Item,
  GetTickerParams,
  GetTradesTicks200Item,
  GetTradesTicksParams,
  Minute1Params,
  Minute1200Item,
  Month200Item,
  MonthParams,
  Week200Item,
  WeekParams,
} from "../generated/public/model";

export interface BithumbCredentials {
  apiKey: string;
  secretKey: string;
}

export type BithumbClientOptions = ExHubClientOptions<BithumbCredentials>;

export interface BithumbClient {
  markets: {
    getMarketAll: (params?: GetMarketAllParams) => Promise<GetMarketAll200Item[]>;
    getMarketVirtualAssetWarning: () => Promise<GetMarketVirtualAssetWarning200Item[]>;
  };
  candles: {
    minute1: (params: Minute1Params, unit?: number) => Promise<Minute1200Item[]>;
    day: (params: DayParams) => Promise<Day200Item[]>;
    week: (params: WeekParams) => Promise<Week200Item[]>;
    month: (params: MonthParams) => Promise<Month200Item[]>;
  };
  trades: {
    getTradesTicks: (params: GetTradesTicksParams) => Promise<GetTradesTicks200Item[]>;
  };
  tickers: {
    getTicker: (params: GetTickerParams) => Promise<GetTicker200Item[]>;
  };
  orderbook: {
    getOrderbook: (params: GetOrderbookParams) => Promise<GetOrderbook200Item[]>;
  };
  service: {
    getNotices: () => Promise<GetNotices200Item[]>;
    getFeeInfo: (currency: string) => Promise<GetFeeInfo200Item[]>;
    getStatusWallet: () => Promise<GetStatusWallet200Item[]>;
    api: () => Promise<Api200Item[]>;
  };
  accounts: {
    getAccounts: () => Promise<GetAccounts200Item[]>;
  };
  orders: {
    getOrdersChance: (params: GetOrdersChanceParams) => Promise<GetOrdersChance200>;
    placeOrder: (body: PostOrdersBody) => Promise<PostOrders201>;
    placeBatchOrders: (body: PostOrdersBatchBody) => Promise<PostOrdersBatch200>;
    getOrder: (params?: GetOrderParams) => Promise<GetOrder200>;
    cancelOrder: (params?: DeleteOrderParams) => Promise<DeleteOrder200>;
    cancelOrders: (body: PostOrdersCancelBody) => Promise<PostOrdersCancel200>;
    getOrders: (params?: GetOrdersParams) => Promise<GetOrders200Item[]>;
    getTwapOrders: (params?: GettwapordersParams) => Promise<Gettwaporders200Item[]>;
    cancelTwapOrder: (params: CanceltwaporderParams) => Promise<Canceltwaporder200Item[]>;
    createTwapOrder: (params: CreatetwaporderParams) => Promise<Createtwaporder200Item[]>;
  };
  withdrawals: {
    getWithdraws: (params?: GetWithdrawsParams) => Promise<GetWithdraws200Item[]>;
    getWithdrawsKrw: (params?: GetWithdrawsKrwParams) => Promise<GetWithdrawsKrw200Item[]>;
    getWithdraw: (params: GetWithdrawParams) => Promise<GetWithdraw200>;
    getWithdrawsChance: (params: GetWithdrawsChanceParams) => Promise<GetWithdrawsChance200>;
    getWithdrawsCoinAddresses: () => Promise<GetWithdrawsCoinAddresses200Item[]>;
    withdrawCoin: (body: PostWithdrawsCoinBody) => Promise<PostWithdrawsCoin201>;
    withdrawKrw: (body: PostWithdrawsKrwBody) => Promise<PostWithdrawsKrw201>;
  };
  deposits: {
    getDeposits: (params?: GetDepositsParams) => Promise<GetDeposits200Item[]>;
    getDepositsKrw: (params?: GetDepositsKrwParams) => Promise<GetDepositsKrw200Item[]>;
    getDeposit: (params: GetDepositParams) => Promise<GetDeposit200>;
    getDepositsCoinAddresses: () => Promise<GetDepositsCoinAddresses200Item[]>;
    getDepositsCoinAddress: (
      params: GetDepositsCoinAddressParams,
    ) => Promise<GetDepositsCoinAddress200>;
    depositKrw: (body: PostDepositsKrwBody) => Promise<PostDepositsKrw201>;
    generateCoinAddress: (
      body: PostDepositsGenerateCoinAddressBody,
    ) => Promise<PostDepositsGenerateCoinAddress201>;
  };
}
