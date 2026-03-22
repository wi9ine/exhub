import type { ExHubClientOptions } from "@exhub/core";
import type {
  AvailableDepositInformation200,
  AvailableDepositInformationParams,
  AvailableOrderInformation200Item,
  AvailableOrderInformationParams,
  AvailableWithdrawalInformation200,
  AvailableWithdrawalInformationParams,
  BatchCancelOrders200,
  BatchCancelOrdersParams,
  CancelAndNewOrder201,
  CancelAndNewOrderBody,
  CancelOrder200,
  CancelOrderParams,
  CancelOrdersByIds200,
  CancelOrdersByIdsParams,
  CancelWithdrawal200,
  CancelWithdrawalParams,
  CreateDepositAddress200,
  CreateDepositAddress201,
  CreateDepositAddressBody,
  DepositKrw201,
  DepositKrwBody,
  GetBalance200Item,
  GetDeposit200,
  GetDepositAddress200,
  GetDepositAddressParams,
  GetDepositParams,
  GetOrder200,
  GetOrderParams,
  GetServiceStatus200Item,
  GetWithdrawal200,
  GetWithdrawalParams,
  ListApiKeys200Item,
  ListClosedOrders200Item,
  ListClosedOrdersParams,
  ListDepositAddresses200Item,
  ListDeposits200Item,
  ListDepositsParams,
  ListOpenOrders200Item,
  ListOpenOrdersParams,
  ListOrdersByIds200Item,
  ListOrdersByIdsParams,
  ListTravelruleVasps200Item,
  ListWithdrawalAddresses200Item,
  ListWithdrawals200Item,
  ListWithdrawalsParams,
  NewOrder201,
  NewOrderBody,
  TestOrder201,
  TestOrderBody,
  VerifyTravelruleByTxid201,
  VerifyTravelruleByTxidBody,
  VerifyTravelruleByUuid201,
  VerifyTravelruleByUuidBody,
  Withdraw201,
  WithdrawBody,
  WithdrawKrw201,
  WithdrawKrwBody,
} from "../generated/exchange/model";
import type {
  ListCandlesDays200Item,
  ListCandlesDaysParams,
  ListCandlesMinutes200Item,
  ListCandlesMinutesParams,
  ListCandlesMonths200Item,
  ListCandlesMonthsParams,
  ListCandlesSeconds200Item,
  ListCandlesSecondsParams,
  ListCandlesWeeks200Item,
  ListCandlesWeeksParams,
  ListCandlesYears200Item,
  ListCandlesYearsParams,
  ListOrderbookInstruments200Item,
  ListOrderbookInstrumentsParams,
  ListOrderbookLevels200Item,
  ListOrderbookLevelsParams,
  ListOrderbooks200Item,
  ListOrderbooksParams,
  ListQuoteTickers200Item,
  ListQuoteTickersParams,
  ListTickers200Item,
  ListTickersParams,
  ListTradingPairs200Item,
  ListTradingPairsParams,
  RecentTradesHistory200Item,
  RecentTradesHistoryParams,
} from "../generated/quotation/model";

export interface UpbitCredentials {
  accessKey: string;
  secretKey: string;
}

export type UpbitClientOptions = ExHubClientOptions<UpbitCredentials>;

export interface UpbitClient {
  tradingPairs: {
    listTradingPairs: (params?: ListTradingPairsParams) => Promise<ListTradingPairs200Item[]>;
  };
  candles: {
    listCandlesSeconds: (params: ListCandlesSecondsParams) => Promise<ListCandlesSeconds200Item[]>;
    listCandlesMinutes: (
      unit: 1 | 3 | 5 | 10 | 15 | 30 | 60 | 240,
      params: ListCandlesMinutesParams,
    ) => Promise<ListCandlesMinutes200Item[]>;
    listCandlesDays: (params: ListCandlesDaysParams) => Promise<ListCandlesDays200Item[]>;
    listCandlesWeeks: (params: ListCandlesWeeksParams) => Promise<ListCandlesWeeks200Item[]>;
    listCandlesMonths: (params: ListCandlesMonthsParams) => Promise<ListCandlesMonths200Item[]>;
    listCandlesYears: (params: ListCandlesYearsParams) => Promise<ListCandlesYears200Item[]>;
  };
  trades: {
    recentTradesHistory: (
      params: RecentTradesHistoryParams,
    ) => Promise<RecentTradesHistory200Item[]>;
  };
  tickers: {
    listTickers: (params: ListTickersParams) => Promise<ListTickers200Item[]>;
    listQuoteTickers: (params: ListQuoteTickersParams) => Promise<ListQuoteTickers200Item[]>;
  };
  orderbook: {
    listOrderbooks: (params: ListOrderbooksParams) => Promise<ListOrderbooks200Item[]>;
    listOrderbookInstruments: (
      params: ListOrderbookInstrumentsParams,
    ) => Promise<ListOrderbookInstruments200Item[]>;
    listOrderbookLevels: (
      params: ListOrderbookLevelsParams,
    ) => Promise<ListOrderbookLevels200Item[]>;
  };
  assets: {
    getBalance: () => Promise<GetBalance200Item[]>;
  };
  orders: {
    availableOrderInformation: (
      params: AvailableOrderInformationParams,
    ) => Promise<AvailableOrderInformation200Item[]>;
    newOrder: (body: NewOrderBody) => Promise<NewOrder201>;
    testOrder: (body: TestOrderBody) => Promise<TestOrder201>;
    getOrder: (params?: GetOrderParams) => Promise<GetOrder200>;
    cancelOrder: (params?: CancelOrderParams) => Promise<CancelOrder200>;
    listOrdersByIds: (params?: ListOrdersByIdsParams) => Promise<ListOrdersByIds200Item[]>;
    cancelOrdersByIds: (params?: CancelOrdersByIdsParams) => Promise<CancelOrdersByIds200>;
    listOpenOrders: (params?: ListOpenOrdersParams) => Promise<ListOpenOrders200Item[]>;
    batchCancelOrders: (params?: BatchCancelOrdersParams) => Promise<BatchCancelOrders200>;
    listClosedOrders: (params?: ListClosedOrdersParams) => Promise<ListClosedOrders200Item[]>;
    cancelAndNewOrder: (body: CancelAndNewOrderBody) => Promise<CancelAndNewOrder201>;
  };
  withdrawals: {
    availableWithdrawalInformation: (
      params: AvailableWithdrawalInformationParams,
    ) => Promise<AvailableWithdrawalInformation200>;
    listWithdrawalAddresses: () => Promise<ListWithdrawalAddresses200Item[]>;
    withdraw: (body: WithdrawBody) => Promise<Withdraw201>;
    cancelWithdrawal: (params: CancelWithdrawalParams) => Promise<CancelWithdrawal200>;
    withdrawKrw: (body: WithdrawKrwBody) => Promise<WithdrawKrw201>;
    getWithdrawal: (params?: GetWithdrawalParams) => Promise<GetWithdrawal200>;
    listWithdrawals: (params?: ListWithdrawalsParams) => Promise<ListWithdrawals200Item[]>;
  };
  deposits: {
    availableDepositInformation: (
      params: AvailableDepositInformationParams,
    ) => Promise<AvailableDepositInformation200>;
    createDepositAddress: (
      body: CreateDepositAddressBody,
    ) => Promise<CreateDepositAddress200 | CreateDepositAddress201>;
    getDepositAddress: (params: GetDepositAddressParams) => Promise<GetDepositAddress200>;
    listDepositAddresses: () => Promise<ListDepositAddresses200Item[]>;
    depositKrw: (body: DepositKrwBody) => Promise<DepositKrw201>;
    getDeposit: (params?: GetDepositParams) => Promise<GetDeposit200>;
    listDeposits: (params?: ListDepositsParams) => Promise<ListDeposits200Item[]>;
  };
  travelRule: {
    listTravelruleVasps: () => Promise<ListTravelruleVasps200Item[]>;
    verifyTravelruleByUuid: (
      body: VerifyTravelruleByUuidBody,
    ) => Promise<VerifyTravelruleByUuid201>;
    verifyTravelruleByTxid: (
      body: VerifyTravelruleByTxidBody,
    ) => Promise<VerifyTravelruleByTxid201>;
  };
  service: {
    getServiceStatus: () => Promise<GetServiceStatus200Item[]>;
    listApiKeys: () => Promise<ListApiKeys200Item[]>;
  };
}
