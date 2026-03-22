import {
  createHs256Jwt,
  createNonce,
  resolveBaseUrl,
  sha512HexDigest,
  toQueryString,
} from "@exhub/core";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import * as privateApi from "../generated/private";
import * as publicApi from "../generated/public";
import type { BithumbClient, BithumbClientOptions, BithumbCredentials } from "./types";

const BITHUMB_DEFAULT_BASE_URL = "https://api.bithumb.com/v1";

function createPublicRequestConfig(options: BithumbClientOptions): AxiosRequestConfig {
  return {
    baseURL: resolveBaseUrl(BITHUMB_DEFAULT_BASE_URL, options.baseURL),
    timeout: options.timeout ?? 10_000,
  };
}

function resolveCredentials(
  options: BithumbClientOptions,
): Promise<BithumbCredentials> | BithumbCredentials {
  if (options.credentialsProvider) return options.credentialsProvider();
  if (options.credentials) return options.credentials;
  throw new Error("Bithumb 인증 정보가 설정되지 않았습니다.");
}

async function createPrivateRequestConfig(
  options: BithumbClientOptions,
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
    baseURL: resolveBaseUrl(BITHUMB_DEFAULT_BASE_URL, options.baseURL),
    timeout: options.timeout ?? 10_000,
    headers: {
      Authorization: `Bearer ${createHs256Jwt(tokenPayload, credentials.secretKey)}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
}

function callPublicWithParams<TParams, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
) {
  return async (params: TParams) => (await fn(params, createPublicRequestConfig(options))).data;
}

function callPublicWithPath<TPath, TResult>(
  fn: (path: TPath, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
) {
  return async (path: TPath) => (await fn(path, createPublicRequestConfig(options))).data;
}

function callPublicWithParamsAndPath<TParams, TResult>(
  fn: (
    params: TParams,
    unit?: number,
    options?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
) {
  return async (params: TParams, unit?: number) =>
    (await fn(params, unit, createPublicRequestConfig(options))).data;
}

function callPublicNoInput<TResult>(
  fn: (options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
) {
  return async () => (await fn(createPublicRequestConfig(options))).data;
}

function callPrivateWithParams<TParams extends Record<string, unknown> | undefined, TResult>(
  fn: (params: TParams, options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
) {
  return async (params: TParams) =>
    (await fn(params, await createPrivateRequestConfig(options, params))).data;
}

function callPrivateNoInput<TResult>(
  fn: (options?: AxiosRequestConfig) => Promise<AxiosResponse<TResult>>,
  options: BithumbClientOptions,
) {
  return async () => (await fn(await createPrivateRequestConfig(options))).data;
}

export function createBithumbClient(options: BithumbClientOptions = {}): BithumbClient {
  return {
    markets: {
      getMarketAll: callPublicWithParams(publicApi.getMarketAll, options),
      getMarketVirtualAssetWarning: callPublicNoInput(
        publicApi.getMarketVirtualAssetWarning,
        options,
      ),
    },
    candles: {
      minute1: callPublicWithParamsAndPath(publicApi.minute1, options),
      day: callPublicWithParams(publicApi.day, options),
      week: callPublicWithParams(publicApi.week, options),
      month: callPublicWithParams(publicApi.month, options),
    },
    trades: {
      getTradesTicks: callPublicWithParams(publicApi.getTradesTicks, options),
    },
    tickers: {
      getTicker: callPublicWithParams(publicApi.getTicker, options),
    },
    orderbook: {
      getOrderbook: callPublicWithParams(publicApi.getOrderbook, options),
    },
    service: {
      getNotices: callPublicNoInput(publicApi.getNotices, options),
      getCreditLendingmarginLevel1: callPublicWithPath(
        publicApi.getCreditLendingmarginLevel1,
        options,
      ),
      getStatusWallet: callPrivateNoInput(privateApi.getStatusWallet, options),
      api: callPrivateNoInput(privateApi.api, options),
    },
    accounts: {
      getAccounts: callPrivateNoInput(privateApi.getAccounts, options),
    },
    orders: {
      getOrdersChance: callPrivateWithParams(privateApi.getOrdersChance, options),
      getOrder: callPrivateWithParams(privateApi.getOrder, options),
      getOrders: callPrivateWithParams(privateApi.getOrders, options),
      getOrders1: callPrivateWithParams(privateApi.getOrders1, options),
      getOrders11: callPrivateWithParams(privateApi.getOrders11, options),
      getOrders111: callPrivateWithParams(privateApi.getOrders111, options),
    },
    withdrawals: {
      getWithdraws: callPrivateWithParams(privateApi.getWithdraws, options),
      getWithdrawsKrw: callPrivateWithParams(privateApi.getWithdrawsKrw, options),
      getWithdraw: callPrivateWithParams(privateApi.getWithdraw, options),
      getWithdrawsChance: callPrivateWithParams(privateApi.getWithdrawsChance, options),
      getWithdrawsCoinAddresses: callPrivateNoInput(privateApi.getWithdrawsCoinAddresses, options),
    },
    deposits: {
      getDeposits: callPrivateWithParams(privateApi.getDeposits, options),
      getDepositsKrw: callPrivateWithParams(privateApi.getDepositsKrw, options),
      getDeposit: callPrivateWithParams(privateApi.getDeposit, options),
      getDepositsCoinAddresses: callPrivateNoInput(privateApi.getDepositsCoinAddresses, options),
      getDepositsCoinAddress: callPrivateWithParams(privateApi.getDepositsCoinAddress, options),
    },
  };
}
