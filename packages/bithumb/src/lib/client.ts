import {
  createHs256Jwt,
  createNonce,
  ExHubConfigurationError,
  resolveBaseUrl,
  sha512HexDigest,
  toQueryString,
} from "@exhub/core";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import * as privateApi from "../generated/private";
import * as publicApi from "../generated/public";
import type { BithumbClient, BithumbClientOptions, BithumbCredentials } from "./types";

const BITHUMB_DEFAULT_BASE_URL = "https://api.bithumb.com";

function createPublicRequestConfig(baseURL: string, timeout: number): AxiosRequestConfig {
  return {
    baseURL,
    timeout,
  };
}

function resolveCredentials(
  options: BithumbClientOptions,
): Promise<BithumbCredentials> | BithumbCredentials {
  if (options.credentialsProvider) return options.credentialsProvider();
  if (options.credentials) return options.credentials;
  throw new ExHubConfigurationError("Bithumb 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig(
  options: BithumbClientOptions,
  baseURL: string,
  timeout: number,
  payload?: Record<string, unknown>,
): Promise<AxiosRequestConfig> {
  const credentials = await resolveCredentials(options);
  const queryString = payload ? toQueryString(payload) : "";
  const tokenPayload = {
    access_key: credentials.apiKey,
    nonce: createNonce(),
    timestamp: Date.now(),
    ...(queryString
      ? {
          query_hash: sha512HexDigest(queryString),
          query_hash_alg: "SHA512",
        }
      : {}),
  };

  return {
    baseURL,
    timeout,
    headers: {
      Authorization: `Bearer ${createHs256Jwt(tokenPayload, credentials.secretKey)}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
}

function callPublicWithParams<TParams, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  baseURL: string,
  timeout: number,
) {
  return async (params: TParams) =>
    (await fn(params, createPublicRequestConfig(baseURL, timeout))).data;
}

function callPublicWithPath<TPath, TResult>(
  fn: (path: TPath, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  baseURL: string,
  timeout: number,
) {
  return async (path: TPath) => (await fn(path, createPublicRequestConfig(baseURL, timeout))).data;
}

function callPublicWithParamsAndPath<TParams, TResult>(
  fn: (
    params: TParams,
    unit?: number,
    options?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<TResult>>,
  baseURL: string,
  timeout: number,
) {
  return async (params: TParams, unit?: number) =>
    (await fn(params, unit, createPublicRequestConfig(baseURL, timeout))).data;
}

function callPublicNoInput<TResult>(
  fn: (options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  baseURL: string,
  timeout: number,
) {
  return async () => (await fn(createPublicRequestConfig(baseURL, timeout))).data;
}

function callPrivateWithParams<TParams extends Record<string, unknown> | undefined, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
  baseURL: string,
  timeout: number,
) {
  return async (params: TParams) =>
    (await fn(params, await createPrivateRequestConfig(options, baseURL, timeout, params))).data;
}

function callPrivateNoInput<TResult>(
  fn: (options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
  baseURL: string,
  timeout: number,
) {
  return async () => (await fn(await createPrivateRequestConfig(options, baseURL, timeout))).data;
}

export function createBithumbClient(options: BithumbClientOptions = {}): BithumbClient {
  const baseURL = resolveBaseUrl(BITHUMB_DEFAULT_BASE_URL, options.baseURL);
  const timeout = options.timeout ?? 10_000;

  return {
    markets: {
      getMarketAll: callPublicWithParams(publicApi.getMarketAll, baseURL, timeout),
      getMarketVirtualAssetWarning: callPublicNoInput(
        publicApi.getMarketVirtualAssetWarning,
        baseURL,
        timeout,
      ),
    },
    candles: {
      minute1: callPublicWithParamsAndPath(publicApi.minute1, baseURL, timeout),
      day: callPublicWithParams(publicApi.day, baseURL, timeout),
      week: callPublicWithParams(publicApi.week, baseURL, timeout),
      month: callPublicWithParams(publicApi.month, baseURL, timeout),
    },
    trades: {
      getTradesTicks: callPublicWithParams(publicApi.getTradesTicks, baseURL, timeout),
    },
    tickers: {
      getTicker: callPublicWithParams(publicApi.getTicker, baseURL, timeout),
    },
    orderbook: {
      getOrderbook: callPublicWithParams(publicApi.getOrderbook, baseURL, timeout),
    },
    service: {
      getNotices: callPublicNoInput(publicApi.getNotices, baseURL, timeout),
      getFeeInfo: callPublicWithPath(publicApi.getFeeInfo, baseURL, timeout),
      getStatusWallet: callPrivateNoInput(privateApi.getStatusWallet, options, baseURL, timeout),
      api: callPrivateNoInput(privateApi.api, options, baseURL, timeout),
    },
    accounts: {
      getAccounts: callPrivateNoInput(privateApi.getAccounts, options, baseURL, timeout),
    },
    orders: {
      getOrdersChance: callPrivateWithParams(privateApi.getOrdersChance, options, baseURL, timeout),
      getOrder: callPrivateWithParams(privateApi.getOrder, options, baseURL, timeout),
      getOrders: callPrivateWithParams(privateApi.getOrders, options, baseURL, timeout),
      getTwapOrders: callPrivateWithParams(privateApi.gettwaporders, options, baseURL, timeout),
      cancelTwapOrder: callPrivateWithParams(privateApi.canceltwaporder, options, baseURL, timeout),
      createTwapOrder: callPrivateWithParams(privateApi.createtwaporder, options, baseURL, timeout),
    },
    withdrawals: {
      getWithdraws: callPrivateWithParams(privateApi.getWithdraws, options, baseURL, timeout),
      getWithdrawsKrw: callPrivateWithParams(privateApi.getWithdrawsKrw, options, baseURL, timeout),
      getWithdraw: callPrivateWithParams(privateApi.getWithdraw, options, baseURL, timeout),
      getWithdrawsChance: callPrivateWithParams(
        privateApi.getWithdrawsChance,
        options,
        baseURL,
        timeout,
      ),
      getWithdrawsCoinAddresses: callPrivateNoInput(
        privateApi.getWithdrawsCoinAddresses,
        options,
        baseURL,
        timeout,
      ),
    },
    deposits: {
      getDeposits: callPrivateWithParams(privateApi.getDeposits, options, baseURL, timeout),
      getDepositsKrw: callPrivateWithParams(privateApi.getDepositsKrw, options, baseURL, timeout),
      getDeposit: callPrivateWithParams(privateApi.getDeposit, options, baseURL, timeout),
      getDepositsCoinAddresses: callPrivateNoInput(
        privateApi.getDepositsCoinAddresses,
        options,
        baseURL,
        timeout,
      ),
      getDepositsCoinAddress: callPrivateWithParams(
        privateApi.getDepositsCoinAddress,
        options,
        baseURL,
        timeout,
      ),
    },
  };
}
