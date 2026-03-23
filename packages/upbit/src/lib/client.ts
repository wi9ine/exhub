import {
  createHs256Jwt,
  createNonce,
  ExHubConfigurationError,
  resolveBaseUrl,
  sha512HexDigest,
  toQueryString,
} from "@exhub/core";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import * as exchangeApi from "../generated/exchange/index";
import * as quotationApi from "../generated/quotation/index";
import type { UpbitClient, UpbitClientOptions, UpbitCredentials } from "./types";

const UPBIT_DEFAULT_BASE_URL = "https://api.upbit.com/v1";

function createPublicRequestConfig(baseURL: string, timeout: number): AxiosRequestConfig {
  return {
    baseURL,
    timeout,
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
  throw new ExHubConfigurationError("Upbit 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig(
  options: UpbitClientOptions,
  baseURL: string,
  timeout: number,
  payload: Record<string, unknown> | undefined,
): Promise<AxiosRequestConfig> {
  const credentials = await resolveCredentials(options);
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
    timeout,
    headers: {
      Authorization: authorization,
      Accept: "application/json",
    },
  };
}

function callPublicWithParams<TParams, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  baseURL: string,
  timeout: number,
) {
  return async (params: TParams) => {
    const response = await fn(params, createPublicRequestConfig(baseURL, timeout));
    return response.data;
  };
}

function callPublicWithPathAndParams<TPath, TParams, TResult>(
  fn: (
    pathParam: TPath,
    params: TParams,
    options?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<TResult>>,
  baseURL: string,
  timeout: number,
) {
  return async (pathParam: TPath, params: TParams) => {
    const response = await fn(pathParam, params, createPublicRequestConfig(baseURL, timeout));
    return response.data;
  };
}

function callPrivateWithoutInput<TResult>(
  fn: (options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
  baseURL: string,
  timeout: number,
) {
  return async () => {
    const response = await fn(
      await createPrivateRequestConfig(options, baseURL, timeout, undefined),
    );
    return response.data;
  };
}

function callPrivateWithParams<TParams extends Record<string, unknown> | undefined, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
  baseURL: string,
  timeout: number,
) {
  return async (params: TParams) => {
    const response = await fn(
      params,
      await createPrivateRequestConfig(options, baseURL, timeout, params),
    );
    return response.data;
  };
}

function callPrivateWithBody<TBody extends Record<string, unknown>, TResult>(
  fn: (body: TBody, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: UpbitClientOptions,
  baseURL: string,
  timeout: number,
) {
  return async (body: TBody) => {
    const response = await fn(
      body,
      await createPrivateRequestConfig(options, baseURL, timeout, body),
    );
    return response.data;
  };
}

export function createUpbitClient(options: UpbitClientOptions = {}): UpbitClient {
  const baseURL = resolveBaseUrl(UPBIT_DEFAULT_BASE_URL, options.baseURL);
  const timeout = options.timeout ?? 10_000;

  return {
    tradingPairs: {
      listTradingPairs: callPublicWithParams(quotationApi.listTradingPairs, baseURL, timeout),
    },
    candles: {
      listCandlesSeconds: callPublicWithParams(quotationApi.listCandlesSeconds, baseURL, timeout),
      listCandlesMinutes: callPublicWithPathAndParams(
        quotationApi.listCandlesMinutes,
        baseURL,
        timeout,
      ),
      listCandlesDays: callPublicWithParams(quotationApi.listCandlesDays, baseURL, timeout),
      listCandlesWeeks: callPublicWithParams(quotationApi.listCandlesWeeks, baseURL, timeout),
      listCandlesMonths: callPublicWithParams(quotationApi.listCandlesMonths, baseURL, timeout),
      listCandlesYears: callPublicWithParams(quotationApi.listCandlesYears, baseURL, timeout),
    },
    trades: {
      recentTradesHistory: callPublicWithParams(quotationApi.recentTradesHistory, baseURL, timeout),
    },
    tickers: {
      listTickers: callPublicWithParams(quotationApi.listTickers, baseURL, timeout),
      listQuoteTickers: callPublicWithParams(quotationApi.listQuoteTickers, baseURL, timeout),
    },
    orderbook: {
      listOrderbooks: callPublicWithParams(quotationApi.listOrderbooks, baseURL, timeout),
      listOrderbookInstruments: callPublicWithParams(
        quotationApi.listOrderbookInstruments,
        baseURL,
        timeout,
      ),
      listOrderbookLevels: callPublicWithParams(quotationApi.listOrderbookLevels, baseURL, timeout),
    },
    assets: {
      getBalance: callPrivateWithoutInput(exchangeApi.getBalance, options, baseURL, timeout),
    },
    orders: {
      availableOrderInformation: callPrivateWithParams(
        exchangeApi.availableOrderInformation,
        options,
        baseURL,
        timeout,
      ),
      newOrder: callPrivateWithBody(exchangeApi.newOrder, options, baseURL, timeout),
      testOrder: callPrivateWithBody(exchangeApi.testOrder, options, baseURL, timeout),
      getOrder: callPrivateWithParams(exchangeApi.getOrder, options, baseURL, timeout),
      cancelOrder: callPrivateWithParams(exchangeApi.cancelOrder, options, baseURL, timeout),
      listOrdersByIds: callPrivateWithParams(
        exchangeApi.listOrdersByIds,
        options,
        baseURL,
        timeout,
      ),
      cancelOrdersByIds: callPrivateWithParams(
        exchangeApi.cancelOrdersByIds,
        options,
        baseURL,
        timeout,
      ),
      listOpenOrders: callPrivateWithParams(exchangeApi.listOpenOrders, options, baseURL, timeout),
      batchCancelOrders: callPrivateWithParams(
        exchangeApi.batchCancelOrders,
        options,
        baseURL,
        timeout,
      ),
      listClosedOrders: callPrivateWithParams(
        exchangeApi.listClosedOrders,
        options,
        baseURL,
        timeout,
      ),
      cancelAndNewOrder: callPrivateWithBody(
        exchangeApi.cancelAndNewOrder,
        options,
        baseURL,
        timeout,
      ),
    },
    withdrawals: {
      availableWithdrawalInformation: callPrivateWithParams(
        exchangeApi.availableWithdrawalInformation,
        options,
        baseURL,
        timeout,
      ),
      listWithdrawalAddresses: callPrivateWithoutInput(
        exchangeApi.listWithdrawalAddresses,
        options,
        baseURL,
        timeout,
      ),
      withdraw: callPrivateWithBody(exchangeApi.withdraw, options, baseURL, timeout),
      cancelWithdrawal: callPrivateWithParams(
        exchangeApi.cancelWithdrawal,
        options,
        baseURL,
        timeout,
      ),
      withdrawKrw: callPrivateWithBody(exchangeApi.withdrawKrw, options, baseURL, timeout),
      getWithdrawal: callPrivateWithParams(exchangeApi.getWithdrawal, options, baseURL, timeout),
      listWithdrawals: callPrivateWithParams(
        exchangeApi.listWithdrawals,
        options,
        baseURL,
        timeout,
      ),
    },
    deposits: {
      availableDepositInformation: callPrivateWithParams(
        exchangeApi.availableDepositInformation,
        options,
        baseURL,
        timeout,
      ),
      createDepositAddress: callPrivateWithBody(
        exchangeApi.createDepositAddress,
        options,
        baseURL,
        timeout,
      ),
      getDepositAddress: callPrivateWithParams(
        exchangeApi.getDepositAddress,
        options,
        baseURL,
        timeout,
      ),
      listDepositAddresses: callPrivateWithoutInput(
        exchangeApi.listDepositAddresses,
        options,
        baseURL,
        timeout,
      ),
      depositKrw: callPrivateWithBody(exchangeApi.depositKrw, options, baseURL, timeout),
      getDeposit: callPrivateWithParams(exchangeApi.getDeposit, options, baseURL, timeout),
      listDeposits: callPrivateWithParams(exchangeApi.listDeposits, options, baseURL, timeout),
    },
    travelRule: {
      listTravelruleVasps: callPrivateWithoutInput(
        exchangeApi.listTravelruleVasps,
        options,
        baseURL,
        timeout,
      ),
      verifyTravelruleByUuid: callPrivateWithBody(
        exchangeApi.verifyTravelruleByUuid,
        options,
        baseURL,
        timeout,
      ),
      verifyTravelruleByTxid: callPrivateWithBody(
        exchangeApi.verifyTravelruleByTxid,
        options,
        baseURL,
        timeout,
      ),
    },
    service: {
      getServiceStatus: callPrivateWithoutInput(
        exchangeApi.getServiceStatus,
        options,
        baseURL,
        timeout,
      ),
      listApiKeys: callPrivateWithoutInput(exchangeApi.listApiKeys, options, baseURL, timeout),
    },
  };
}
