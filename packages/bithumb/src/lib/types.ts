import type { ExHubClientOptions } from "@exhub/core";
import type {
  Api200Item,
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
  GetOrders1Params,
  GetOrders11Params,
  GetOrders111Params,
  GetOrders200Item,
  GetOrders1200Item,
  GetOrders11200Item,
  GetOrders111200Item,
  GetOrdersChance200,
  GetOrdersChanceParams,
  GetOrdersParams,
  GetStatusWallet200Item,
  GetWithdraw200,
  GetWithdrawParams,
  GetWithdraws200Item,
  GetWithdrawsChance200,
  GetWithdrawsChanceParams,
  GetWithdrawsCoinAddresses200Item,
  GetWithdrawsKrw200Item,
  GetWithdrawsKrwParams,
  GetWithdrawsParams,
} from "../generated/private/model";
import type {
  Day200Item,
  DayParams,
  GetCreditLendingmarginLevel1200Item,
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
    getCreditLendingmarginLevel1: (
      currency: string,
    ) => Promise<GetCreditLendingmarginLevel1200Item[]>;
    getStatusWallet: () => Promise<GetStatusWallet200Item[]>;
    api: () => Promise<Api200Item[]>;
  };
  accounts: {
    getAccounts: () => Promise<GetAccounts200Item[]>;
  };
  orders: {
    getOrdersChance: (params: GetOrdersChanceParams) => Promise<GetOrdersChance200>;
    getOrder: (params?: GetOrderParams) => Promise<GetOrder200>;
    getOrders: (params?: GetOrdersParams) => Promise<GetOrders200Item[]>;
    getOrders1: (params?: GetOrders1Params) => Promise<GetOrders1200Item[]>;
    getOrders11: (params: GetOrders11Params) => Promise<GetOrders11200Item[]>;
    getOrders111: (params: GetOrders111Params) => Promise<GetOrders111200Item[]>;
  };
  withdrawals: {
    getWithdraws: (params?: GetWithdrawsParams) => Promise<GetWithdraws200Item[]>;
    getWithdrawsKrw: (params?: GetWithdrawsKrwParams) => Promise<GetWithdrawsKrw200Item[]>;
    getWithdraw: (params: GetWithdrawParams) => Promise<GetWithdraw200>;
    getWithdrawsChance: (params: GetWithdrawsChanceParams) => Promise<GetWithdrawsChance200>;
    getWithdrawsCoinAddresses: () => Promise<GetWithdrawsCoinAddresses200Item[]>;
  };
  deposits: {
    getDeposits: (params?: GetDepositsParams) => Promise<GetDeposits200Item[]>;
    getDepositsKrw: (params?: GetDepositsKrwParams) => Promise<GetDepositsKrw200Item[]>;
    getDeposit: (params: GetDepositParams) => Promise<GetDeposit200>;
    getDepositsCoinAddresses: () => Promise<GetDepositsCoinAddresses200Item[]>;
    getDepositsCoinAddress: (
      params: GetDepositsCoinAddressParams,
    ) => Promise<GetDepositsCoinAddress200>;
  };
}
