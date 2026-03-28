// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createRequestFunctions } from "./auth";
import type { UpbitClient, UpbitClientOptions } from "./types";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

export function createUpbitClient(options: UpbitClientOptions = {}): UpbitClient {
  const { requestPublic, requestPrivate } = createRequestFunctions(options);

  return {
    tradingPairs: {
      listTradingPairs: async (params) =>
        requestPublic<AsyncResult<UpbitClient["tradingPairs"]["listTradingPairs"]>>(
          "/market/all",
          params,
        ),
    },
    candles: {
      getSecondCandles: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["getSecondCandles"]>>(
          "/candles/seconds",
          params,
        ),
      getMinuteCandles: async (unit, params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["getMinuteCandles"]>>(
          `/candles/minutes/${unit}`,
          params,
        ),
      getDayCandles: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["getDayCandles"]>>(
          "/candles/days",
          params,
        ),
      getWeekCandles: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["getWeekCandles"]>>(
          "/candles/weeks",
          params,
        ),
      getMonthCandles: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["getMonthCandles"]>>(
          "/candles/months",
          params,
        ),
      getYearCandles: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["getYearCandles"]>>(
          "/candles/years",
          params,
        ),
    },
    trades: {
      listTradesTicks: async (params) =>
        requestPublic<AsyncResult<UpbitClient["trades"]["listTradesTicks"]>>(
          "/trades/ticks",
          params,
        ),
    },
    tickers: {
      listTickers: async (params) =>
        requestPublic<AsyncResult<UpbitClient["tickers"]["listTickers"]>>("/ticker", params),
      listQuoteTickers: async (params) =>
        requestPublic<AsyncResult<UpbitClient["tickers"]["listQuoteTickers"]>>(
          "/ticker/all",
          params,
        ),
    },
    orderbook: {
      listOrderbooks: async (params) =>
        requestPublic<AsyncResult<UpbitClient["orderbook"]["listOrderbooks"]>>(
          "/orderbook",
          params,
        ),
      listOrderbookInstruments: async (params) =>
        requestPublic<AsyncResult<UpbitClient["orderbook"]["listOrderbookInstruments"]>>(
          "/orderbook/instruments",
          params,
        ),
      listOrderbookSupportedLevels: async (params) =>
        requestPublic<AsyncResult<UpbitClient["orderbook"]["listOrderbookSupportedLevels"]>>(
          "/orderbook/supported_levels",
          params,
        ),
    },
    assets: {
      listBalance: async () =>
        requestPrivate<AsyncResult<UpbitClient["assets"]["listBalance"]>>({
          method: "GET",
          path: "/accounts",
        }),
    },
    orders: {
      getOrderChance: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["getOrderChance"]>>({
          method: "GET",
          path: "/orders/chance",
          query: params,
        }),
      createOrder: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["createOrder"]>>({
          method: "POST",
          path: "/orders",
          body,
        }),
      createTestOrder: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["createTestOrder"]>>({
          method: "POST",
          path: "/orders/test",
          body,
        }),
      getOrder: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["getOrder"]>>({
          method: "GET",
          path: "/order",
          query: params,
        }),
      cancelOrder: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["cancelOrder"]>>({
          method: "DELETE",
          path: "/order",
          query: params,
        }),
      listOrdersByIds: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["listOrdersByIds"]>>({
          method: "GET",
          path: "/orders/uuids",
          query: params,
        }),
      cancelOrdersByIds: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["cancelOrdersByIds"]>>({
          method: "DELETE",
          path: "/orders/uuids",
          query: params,
        }),
      listOpenOrders: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["listOpenOrders"]>>({
          method: "GET",
          path: "/orders/open",
          query: params,
        }),
      cancelOpenOrders: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["cancelOpenOrders"]>>({
          method: "DELETE",
          path: "/orders/open",
          query: params,
        }),
      listClosedOrders: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["listClosedOrders"]>>({
          method: "GET",
          path: "/orders/closed",
          query: params,
        }),
      cancelAndCreateOrder: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["cancelAndCreateOrder"]>>({
          method: "POST",
          path: "/orders/cancel_and_new",
          body,
        }),
    },
    withdrawals: {
      getWithdrawChance: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["getWithdrawChance"]>>({
          method: "GET",
          path: "/withdraws/chance",
          query: params,
        }),
      listWithdrawalAddresses: async () =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["listWithdrawalAddresses"]>>({
          method: "GET",
          path: "/withdraws/coin_addresses",
        }),
      createWithdrawal: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["createWithdrawal"]>>({
          method: "POST",
          path: "/withdraws/coin",
          body,
        }),
      cancelWithdrawal: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["cancelWithdrawal"]>>({
          method: "DELETE",
          path: "/withdraws/coin",
          query: params,
        }),
      createWithdrawKrw: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["createWithdrawKrw"]>>({
          method: "POST",
          path: "/withdraws/krw",
          body,
        }),
      getWithdrawal: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["getWithdrawal"]>>({
          method: "GET",
          path: "/withdraw",
          query: params,
        }),
      listWithdrawals: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["listWithdrawals"]>>({
          method: "GET",
          path: "/withdraws",
          query: params,
        }),
    },
    deposits: {
      getDepositChance: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["getDepositChance"]>>({
          method: "GET",
          path: "/deposits/chance/coin",
          query: params,
        }),
      createDepositAddress: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["createDepositAddress"]>>({
          method: "POST",
          path: "/deposits/generate_coin_address",
          body,
        }),
      getDepositAddress: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["getDepositAddress"]>>({
          method: "GET",
          path: "/deposits/coin_address",
          query: params,
        }),
      listDepositAddresses: async () =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["listDepositAddresses"]>>({
          method: "GET",
          path: "/deposits/coin_addresses",
        }),
      createDepositKrw: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["createDepositKrw"]>>({
          method: "POST",
          path: "/deposits/krw",
          body,
        }),
      getDeposit: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["getDeposit"]>>({
          method: "GET",
          path: "/deposit",
          query: params,
        }),
      listDeposits: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["listDeposits"]>>({
          method: "GET",
          path: "/deposits",
          query: params,
        }),
    },
    travelRule: {
      listTravelRuleVasps: async () =>
        requestPrivate<AsyncResult<UpbitClient["travelRule"]["listTravelRuleVasps"]>>({
          method: "GET",
          path: "/travel_rule/vasps",
        }),
      verifyTravelRuleByUuid: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["travelRule"]["verifyTravelRuleByUuid"]>>({
          method: "POST",
          path: "/travel_rule/deposit/uuid",
          body,
        }),
      verifyTravelRuleByTxid: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["travelRule"]["verifyTravelRuleByTxid"]>>({
          method: "POST",
          path: "/travel_rule/deposit/txid",
          body,
        }),
    },
    service: {
      getServiceStatus: async () =>
        requestPrivate<AsyncResult<UpbitClient["service"]["getServiceStatus"]>>({
          method: "GET",
          path: "/status/wallet",
        }),
      listApiKeys: async () =>
        requestPrivate<AsyncResult<UpbitClient["service"]["listApiKeys"]>>({
          method: "GET",
          path: "/api_keys",
        }),
    },
  };
}
