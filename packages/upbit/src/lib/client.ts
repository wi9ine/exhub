import {
  createHs256Jwt,
  createNonce,
  resolveBaseUrl,
  sha512HexDigest,
  toQueryString,
} from "@exhub/core";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import * as exchangeApi from "../generated/exchange/index";
import * as quotationApi from "../generated/quotation/index";
import type { UpbitClient, UpbitClientOptions, UpbitCredentials } from "./types";

const UPBIT_DEFAULT_BASE_URL = "https://api.upbit.com/v1";

function createPublicRequestConfig(options: UpbitClientOptions): AxiosRequestConfig {
  return {
    baseURL: resolveBaseUrl(UPBIT_DEFAULT_BASE_URL, options.baseURL),
    timeout: options.timeout ?? 10_000,
  };
}

function resolveCredentials(
  options: UpbitClientOptions,
): Promise<UpbitCredentials> | UpbitCredentials {
  if (options.credentialsProvider) {
    return options.credentialsProvider();
  }
  if (options.credentials) {
    return options.credentials;
  }
  throw new Error("Upbit 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig(
  options: UpbitClientOptions,
  payload: Record<string, unknown> | undefined,
): Promise<AxiosRequestConfig> {
  const credentials = await resolveCredentials(options);
  const baseURL = resolveBaseUrl(UPBIT_DEFAULT_BASE_URL, options.baseURL);
  const nonce = createNonce();
  const tokenPayload = {
    access_key: credentials.accessKey,
    nonce,
  };

  const queryString = payload ? toQueryString(payload) : "";
  const signedPayload =
    queryString.length > 0
      ? {
          ...tokenPayload,
          query_hash: sha512HexDigest(queryString),
          query_hash_alg: "SHA512",
        }
      : tokenPayload;

  const authorization = `Bearer ${createHs256Jwt(signedPayload, credentials.secretKey)}`;
  return {
    baseURL,
    timeout: options.timeout ?? 10_000,
    headers: {
      Authorization: authorization,
      Accept: "application/json",
    },
  };
}

function callPublicWithParams<TParams, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
) {
  return async (params: TParams) => {
    const response = await fn(params, createPublicRequestConfig(options));
    return response.data;
  };
}

function callPublicWithPathAndParams<TPath, TParams, TResult>(
  fn: (
    pathParam: TPath,
    params: TParams,
    options?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
) {
  return async (pathParam: TPath, params: TParams) => {
    const response = await fn(pathParam, params, createPublicRequestConfig(options));
    return response.data;
  };
}

function callPrivateWithoutInput<TResult>(
  fn: (options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
) {
  return async () => {
    const response = await fn(await createPrivateRequestConfig(options, undefined));
    return response.data;
  };
}

function callPrivateWithParams<TParams extends Record<string, unknown> | undefined, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
) {
  return async (params: TParams) => {
    const response = await fn(params, await createPrivateRequestConfig(options, params));
    return response.data;
  };
}

function callPrivateWithBody<TBody extends Record<string, unknown>, TResult>(
  fn: (body: TBody, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
) {
  return async (body: TBody) => {
    const response = await fn(body, await createPrivateRequestConfig(options, body));
    return response.data;
  };
}

export function createUpbitClient(options: UpbitClientOptions = {}): UpbitClient {
  return {
    tradingPairs: {
      listTradingPairs: callPublicWithParams(quotationApi.listTradingPairs, options),
    },
    candles: {
      listCandlesSeconds: callPublicWithParams(quotationApi.listCandlesSeconds, options),
      listCandlesMinutes: callPublicWithPathAndParams(quotationApi.listCandlesMinutes, options),
      listCandlesDays: callPublicWithParams(quotationApi.listCandlesDays, options),
      listCandlesWeeks: callPublicWithParams(quotationApi.listCandlesWeeks, options),
      listCandlesMonths: callPublicWithParams(quotationApi.listCandlesMonths, options),
      listCandlesYears: callPublicWithParams(quotationApi.listCandlesYears, options),
    },
    trades: {
      recentTradesHistory: callPublicWithParams(quotationApi.recentTradesHistory, options),
    },
    tickers: {
      listTickers: callPublicWithParams(quotationApi.listTickers, options),
      listQuoteTickers: callPublicWithParams(quotationApi.listQuoteTickers, options),
    },
    orderbook: {
      listOrderbooks: callPublicWithParams(quotationApi.listOrderbooks, options),
      listOrderbookInstruments: callPublicWithParams(
        quotationApi.listOrderbookInstruments,
        options,
      ),
      listOrderbookLevels: callPublicWithParams(quotationApi.listOrderbookLevels, options),
    },
    assets: {
      getBalance: callPrivateWithoutInput(exchangeApi.getBalance, options),
    },
    orders: {
      availableOrderInformation: callPrivateWithParams(
        exchangeApi.availableOrderInformation,
        options,
      ),
      newOrder: callPrivateWithBody(exchangeApi.newOrder, options),
      testOrder: callPrivateWithBody(exchangeApi.testOrder, options),
      getOrder: callPrivateWithParams(exchangeApi.getOrder, options),
      cancelOrder: callPrivateWithParams(exchangeApi.cancelOrder, options),
      listOrdersByIds: callPrivateWithParams(exchangeApi.listOrdersByIds, options),
      cancelOrdersByIds: callPrivateWithParams(exchangeApi.cancelOrdersByIds, options),
      listOpenOrders: callPrivateWithParams(exchangeApi.listOpenOrders, options),
      batchCancelOrders: callPrivateWithParams(exchangeApi.batchCancelOrders, options),
      listClosedOrders: callPrivateWithParams(exchangeApi.listClosedOrders, options),
      cancelAndNewOrder: callPrivateWithBody(exchangeApi.cancelAndNewOrder, options),
    },
    withdrawals: {
      availableWithdrawalInformation: callPrivateWithParams(
        exchangeApi.availableWithdrawalInformation,
        options,
      ),
      listWithdrawalAddresses: callPrivateWithoutInput(
        exchangeApi.listWithdrawalAddresses,
        options,
      ),
      withdraw: callPrivateWithBody(exchangeApi.withdraw, options),
      cancelWithdrawal: callPrivateWithParams(exchangeApi.cancelWithdrawal, options),
      withdrawKrw: callPrivateWithBody(exchangeApi.withdrawKrw, options),
      getWithdrawal: callPrivateWithParams(exchangeApi.getWithdrawal, options),
      listWithdrawals: callPrivateWithParams(exchangeApi.listWithdrawals, options),
    },
    deposits: {
      availableDepositInformation: callPrivateWithParams(
        exchangeApi.availableDepositInformation,
        options,
      ),
      createDepositAddress: callPrivateWithBody(exchangeApi.createDepositAddress, options),
      getDepositAddress: callPrivateWithParams(exchangeApi.getDepositAddress, options),
      listDepositAddresses: callPrivateWithoutInput(exchangeApi.listDepositAddresses, options),
      depositKrw: callPrivateWithBody(exchangeApi.depositKrw, options),
      getDeposit: callPrivateWithParams(exchangeApi.getDeposit, options),
      listDeposits: callPrivateWithParams(exchangeApi.listDeposits, options),
    },
    travelRule: {
      listTravelruleVasps: callPrivateWithoutInput(exchangeApi.listTravelruleVasps, options),
      verifyTravelruleByUuid: callPrivateWithBody(exchangeApi.verifyTravelruleByUuid, options),
      verifyTravelruleByTxid: callPrivateWithBody(exchangeApi.verifyTravelruleByTxid, options),
    },
    service: {
      getServiceStatus: callPrivateWithoutInput(exchangeApi.getServiceStatus, options),
      listApiKeys: callPrivateWithoutInput(exchangeApi.listApiKeys, options),
    },
  };
}
