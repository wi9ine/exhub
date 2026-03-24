import type { ExHubClientOptions } from "@exhub/core";
import type {
  CancelAndCreateOrder201,
  CancelAndCreateOrderBody,
  CancelOpenOrders200,
  CancelOpenOrdersParams,
  CancelOrder200,
  CancelOrderParams,
  CancelOrdersByIds200,
  CancelOrdersByIdsParams,
  CancelWithdrawal200,
  CancelWithdrawalParams,
  CreateDepositAddress200,
  CreateDepositAddress201,
  CreateDepositAddressBody,
  CreateDepositKrw201,
  CreateDepositKrwBody,
  CreateOrder201,
  CreateOrderBody,
  CreateTestOrder201,
  CreateTestOrderBody,
  CreateWithdrawal201,
  CreateWithdrawalBody,
  CreateWithdrawKrw201,
  CreateWithdrawKrwBody,
  GetDeposit200,
  GetDepositAddress200,
  GetDepositAddressParams,
  GetDepositChance200,
  GetDepositChanceParams,
  GetDepositParams,
  GetOrder200,
  GetOrderChance200Item,
  GetOrderChanceParams,
  GetOrderParams,
  GetServiceStatus200Item,
  GetWithdrawChance200,
  GetWithdrawChanceParams,
  GetWithdrawal200,
  GetWithdrawalParams,
  ListApiKeys200Item,
  ListBalance200Item,
  ListClosedOrders200Item,
  ListClosedOrdersParams,
  ListDepositAddresses200Item,
  ListDeposits200Item,
  ListDepositsParams,
  ListOpenOrders200Item,
  ListOpenOrdersParams,
  ListOrdersByIds200Item,
  ListOrdersByIdsParams,
  ListTravelRuleVasps200Item,
  ListWithdrawalAddresses200Item,
  ListWithdrawals200Item,
  ListWithdrawalsParams,
  VerifyTravelRuleByTxid201,
  VerifyTravelRuleByTxidBody,
  VerifyTravelRuleByUuid201,
  VerifyTravelRuleByUuidBody,
} from "../generated/exchange/model";
import type {
  GetDayCandles200Item,
  GetDayCandlesParams,
  GetMinuteCandles200Item,
  GetMinuteCandlesParams,
  GetMonthCandles200Item,
  GetMonthCandlesParams,
  GetSecondCandles200Item,
  GetSecondCandlesParams,
  GetWeekCandles200Item,
  GetWeekCandlesParams,
  GetYearCandles200Item,
  GetYearCandlesParams,
  ListOrderbookInstruments200Item,
  ListOrderbookInstrumentsParams,
  ListOrderbookSupportedLevels200Item,
  ListOrderbookSupportedLevelsParams,
  ListOrderbooks200Item,
  ListOrderbooksParams,
  ListQuoteTickers200Item,
  ListQuoteTickersParams,
  ListTickers200Item,
  ListTickersParams,
  ListTradesTicks200Item,
  ListTradesTicksParams,
  ListTradingPairs200Item,
  ListTradingPairsParams,
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
    getSecondCandles: (params: GetSecondCandlesParams) => Promise<GetSecondCandles200Item[]>;
    getMinuteCandles: (
      unit: 1 | 3 | 5 | 10 | 15 | 30 | 60 | 240,
      params: GetMinuteCandlesParams,
    ) => Promise<GetMinuteCandles200Item[]>;
    getDayCandles: (params: GetDayCandlesParams) => Promise<GetDayCandles200Item[]>;
    getWeekCandles: (params: GetWeekCandlesParams) => Promise<GetWeekCandles200Item[]>;
    getMonthCandles: (params: GetMonthCandlesParams) => Promise<GetMonthCandles200Item[]>;
    getYearCandles: (params: GetYearCandlesParams) => Promise<GetYearCandles200Item[]>;
  };
  trades: {
    listTradesTicks: (params: ListTradesTicksParams) => Promise<ListTradesTicks200Item[]>;
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
    listOrderbookSupportedLevels: (
      params: ListOrderbookSupportedLevelsParams,
    ) => Promise<ListOrderbookSupportedLevels200Item[]>;
  };
  assets: {
    listBalance: () => Promise<ListBalance200Item[]>;
  };
  orders: {
    getOrderChance: (params: GetOrderChanceParams) => Promise<GetOrderChance200Item[]>;
    createOrder: (body: CreateOrderBody) => Promise<CreateOrder201>;
    createTestOrder: (body: CreateTestOrderBody) => Promise<CreateTestOrder201>;
    getOrder: (params?: GetOrderParams) => Promise<GetOrder200>;
    cancelOrder: (params?: CancelOrderParams) => Promise<CancelOrder200>;
    listOrdersByIds: (params?: ListOrdersByIdsParams) => Promise<ListOrdersByIds200Item[]>;
    cancelOrdersByIds: (params?: CancelOrdersByIdsParams) => Promise<CancelOrdersByIds200>;
    listOpenOrders: (params?: ListOpenOrdersParams) => Promise<ListOpenOrders200Item[]>;
    cancelOpenOrders: (params?: CancelOpenOrdersParams) => Promise<CancelOpenOrders200>;
    listClosedOrders: (params?: ListClosedOrdersParams) => Promise<ListClosedOrders200Item[]>;
    cancelAndCreateOrder: (
      body: CancelAndCreateOrderBody,
    ) => Promise<CancelAndCreateOrder201>;
  };
  withdrawals: {
    getWithdrawChance: (params: GetWithdrawChanceParams) => Promise<GetWithdrawChance200>;
    listWithdrawalAddresses: () => Promise<ListWithdrawalAddresses200Item[]>;
    withdraw: (body: CreateWithdrawalBody) => Promise<CreateWithdrawal201>;
    cancelWithdrawal: (params: CancelWithdrawalParams) => Promise<CancelWithdrawal200>;
    createWithdrawKrw: (body: CreateWithdrawKrwBody) => Promise<CreateWithdrawKrw201>;
    getWithdrawal: (params?: GetWithdrawalParams) => Promise<GetWithdrawal200>;
    listWithdrawals: (params?: ListWithdrawalsParams) => Promise<ListWithdrawals200Item[]>;
  };
  deposits: {
    getDepositChance: (params: GetDepositChanceParams) => Promise<GetDepositChance200>;
    createDepositAddress: (
      body: CreateDepositAddressBody,
    ) => Promise<CreateDepositAddress200 | CreateDepositAddress201>;
    getDepositAddress: (params: GetDepositAddressParams) => Promise<GetDepositAddress200>;
    listDepositAddresses: () => Promise<ListDepositAddresses200Item[]>;
    createDepositKrw: (body: CreateDepositKrwBody) => Promise<CreateDepositKrw201>;
    getDeposit: (params?: GetDepositParams) => Promise<GetDeposit200>;
    listDeposits: (params?: ListDepositsParams) => Promise<ListDeposits200Item[]>;
  };
  travelRule: {
    listTravelRuleVasps: () => Promise<ListTravelRuleVasps200Item[]>;
    verifyTravelRuleByUuid: (
      body: VerifyTravelRuleByUuidBody,
    ) => Promise<VerifyTravelRuleByUuid201>;
    verifyTravelRuleByTxid: (
      body: VerifyTravelRuleByTxidBody,
    ) => Promise<VerifyTravelRuleByTxid201>;
  };
  service: {
    getServiceStatus: () => Promise<GetServiceStatus200Item[]>;
    listApiKeys: () => Promise<ListApiKeys200Item[]>;
  };
}
