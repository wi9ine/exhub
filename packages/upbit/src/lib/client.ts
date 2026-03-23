import {
  createHs256Jwt,
  createNonce,
  defaultHttpTransport,
  ExHubConfigurationError,
  resolveBaseUrl,
  sha512HexDigest,
  toQueryString,
} from "@exhub/core";

import type { UpbitClient, UpbitClientOptions, UpbitCredentials } from "./types";

const UPBIT_DEFAULT_BASE_URL = "https://api.upbit.com/v1";

type AsyncResult<TMethod> = TMethod extends (...args: never[]) => Promise<infer TResult>
  ? TResult
  : never;

function resolveCredentials(
  options: UpbitClientOptions,
): Promise<UpbitCredentials> | UpbitCredentials {
  if (options.credentialsProvider) {
    return options.credentialsProvider();
  }
  if (options.credentials) {
    return options.credentials;
  }
  throw new ExHubConfigurationError("Upbit 인증 정보가 설정되지 않았습니다.");
}

export function createUpbitClient(options: UpbitClientOptions = {}): UpbitClient {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(UPBIT_DEFAULT_BASE_URL, options.baseURL);
  const timeout = options.timeout ?? 10_000;

  function requestPublic<TResponse>(
    path: string,
    query?: Record<string, unknown>,
  ): Promise<TResponse> {
    return transport.request<TResponse>({
      method: "GET",
      baseURL,
      path,
      query,
      timeout,
    });
  }

  async function requestPrivate<TResponse>(
    method: "GET" | "POST" | "DELETE",
    path: string,
    query?: Record<string, unknown>,
    body?: Record<string, unknown>,
  ): Promise<TResponse> {
    const credentials = await resolveCredentials(options);
    const nonce = createNonce();
    const tokenPayload = {
      access_key: credentials.accessKey,
      nonce,
    };
    const payload = body ?? query;
    const queryString = payload ? toQueryString(payload) : "";
    const signedPayload =
      queryString.length > 0
        ? {
            ...tokenPayload,
            query_hash: sha512HexDigest(queryString),
            query_hash_alg: "SHA512",
          }
        : tokenPayload;

    return transport.request<TResponse>({
      method,
      baseURL,
      path,
      query,
      body,
      timeout,
      headers: {
        Authorization: `Bearer ${createHs256Jwt(signedPayload, credentials.secretKey)}`,
        Accept: "application/json",
      },
    });
  }

  return {
    tradingPairs: {
      listTradingPairs: async (params) =>
        requestPublic<AsyncResult<UpbitClient["tradingPairs"]["listTradingPairs"]>>(
          "/market/all",
          params,
        ),
    },
    candles: {
      listCandlesSeconds: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["listCandlesSeconds"]>>(
          "/candles/seconds",
          params,
        ),
      listCandlesMinutes: async (unit, params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["listCandlesMinutes"]>>(
          `/candles/minutes/${unit}`,
          params,
        ),
      listCandlesDays: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["listCandlesDays"]>>(
          "/candles/days",
          params,
        ),
      listCandlesWeeks: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["listCandlesWeeks"]>>(
          "/candles/weeks",
          params,
        ),
      listCandlesMonths: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["listCandlesMonths"]>>(
          "/candles/months",
          params,
        ),
      listCandlesYears: async (params) =>
        requestPublic<AsyncResult<UpbitClient["candles"]["listCandlesYears"]>>(
          "/candles/years",
          params,
        ),
    },
    trades: {
      recentTradesHistory: async (params) =>
        requestPublic<AsyncResult<UpbitClient["trades"]["recentTradesHistory"]>>(
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
      listOrderbookLevels: async (params) =>
        requestPublic<AsyncResult<UpbitClient["orderbook"]["listOrderbookLevels"]>>(
          "/orderbook/supported_levels",
          params,
        ),
    },
    assets: {
      getBalance: async () =>
        requestPrivate<AsyncResult<UpbitClient["assets"]["getBalance"]>>("GET", "/accounts"),
    },
    orders: {
      availableOrderInformation: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["availableOrderInformation"]>>(
          "GET",
          "/orders/chance",
          params,
        ),
      newOrder: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["newOrder"]>>(
          "POST",
          "/orders",
          undefined,
          body,
        ),
      testOrder: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["testOrder"]>>(
          "POST",
          "/orders/test",
          undefined,
          body,
        ),
      getOrder: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["getOrder"]>>("GET", "/order", params),
      cancelOrder: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["cancelOrder"]>>(
          "DELETE",
          "/order",
          params,
        ),
      listOrdersByIds: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["listOrdersByIds"]>>(
          "GET",
          "/orders/uuids",
          params,
        ),
      cancelOrdersByIds: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["cancelOrdersByIds"]>>(
          "DELETE",
          "/orders/uuids",
          params,
        ),
      listOpenOrders: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["listOpenOrders"]>>(
          "GET",
          "/orders/open",
          params,
        ),
      batchCancelOrders: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["batchCancelOrders"]>>(
          "DELETE",
          "/orders/open",
          params,
        ),
      listClosedOrders: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["listClosedOrders"]>>(
          "GET",
          "/orders/closed",
          params,
        ),
      cancelAndNewOrder: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["orders"]["cancelAndNewOrder"]>>(
          "POST",
          "/orders/cancel_replace",
          undefined,
          body,
        ),
    },
    withdrawals: {
      availableWithdrawalInformation: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["availableWithdrawalInformation"]>>(
          "GET",
          "/withdraws/chance",
          params,
        ),
      listWithdrawalAddresses: async () =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["listWithdrawalAddresses"]>>(
          "GET",
          "/withdraws/coin_addresses",
        ),
      withdraw: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["withdraw"]>>(
          "POST",
          "/withdraws/coin",
          undefined,
          body,
        ),
      cancelWithdrawal: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["cancelWithdrawal"]>>(
          "DELETE",
          "/withdraw",
          params,
        ),
      withdrawKrw: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["withdrawKrw"]>>(
          "POST",
          "/withdraws/krw",
          undefined,
          body,
        ),
      getWithdrawal: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["getWithdrawal"]>>(
          "GET",
          "/withdraw",
          params,
        ),
      listWithdrawals: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["withdrawals"]["listWithdrawals"]>>(
          "GET",
          "/withdraws",
          params,
        ),
    },
    deposits: {
      availableDepositInformation: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["availableDepositInformation"]>>(
          "GET",
          "/deposits/chance",
          params,
        ),
      createDepositAddress: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["createDepositAddress"]>>(
          "POST",
          "/deposits/generate_coin_address",
          undefined,
          body,
        ),
      getDepositAddress: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["getDepositAddress"]>>(
          "GET",
          "/deposits/coin_address",
          params,
        ),
      listDepositAddresses: async () =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["listDepositAddresses"]>>(
          "GET",
          "/deposits/coin_addresses",
        ),
      depositKrw: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["depositKrw"]>>(
          "POST",
          "/deposits/krw",
          undefined,
          body,
        ),
      getDeposit: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["getDeposit"]>>(
          "GET",
          "/deposit",
          params,
        ),
      listDeposits: async (params) =>
        requestPrivate<AsyncResult<UpbitClient["deposits"]["listDeposits"]>>(
          "GET",
          "/deposits",
          params,
        ),
    },
    travelRule: {
      listTravelruleVasps: async () =>
        requestPrivate<AsyncResult<UpbitClient["travelRule"]["listTravelruleVasps"]>>(
          "GET",
          "/travel_rule/vasps",
        ),
      verifyTravelruleByUuid: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["travelRule"]["verifyTravelruleByUuid"]>>(
          "POST",
          "/travel_rule/deposit/uuid",
          undefined,
          body,
        ),
      verifyTravelruleByTxid: async (body) =>
        requestPrivate<AsyncResult<UpbitClient["travelRule"]["verifyTravelruleByTxid"]>>(
          "POST",
          "/travel_rule/deposit/txid",
          undefined,
          body,
        ),
    },
    service: {
      getServiceStatus: async () =>
        requestPrivate<AsyncResult<UpbitClient["service"]["getServiceStatus"]>>(
          "GET",
          "/status/wallet",
        ),
      listApiKeys: async () =>
        requestPrivate<AsyncResult<UpbitClient["service"]["listApiKeys"]>>("GET", "/api_keys"),
    },
  };
}
