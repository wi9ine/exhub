// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import type { ExHubWsClientOptions } from "@exhub/core";

import type { GopaxCredentials } from "./types";

export type GopaxWsClientOptions = ExHubWsClientOptions<GopaxCredentials>;

export interface OpenOrdersData {
  data: {
    orderId: number;
    status: number;
    side: number;
    type: number;
    price: number;
    orgAmount: number;
    remainAmount: number;
    createdAt: number;
    updatedAt: number;
    tradedBaseAmount: number;
    tradedQuoteAmount: number;
    feeAmount: number;
    feeAssetName: string;
    rewardAmount: number;
    rewardAssetName: string;
    timeInForce: number;
    protection: number;
    forcedCompletionReason: number;
    stopPrice: number;
    takerFeeAmount: number;
    tradingPairName: string;
  }[];
}

export interface BalancesData {
  result: boolean;
  data: string | string | string | string | string | string[];
}

export interface OrderbookSubscribeOptions {
  tradingPairName: string;
}

export interface OrderbookData {
  ask: {
    entryId: number;
    price: number;
    volume: number;
    updatedAt: number;
  }[];
  bid: {
    entryId: number;
    price: number;
    volume: number;
    updatedAt: number;
  }[];
  tradingPairName: string;
  maxEntryId: number;
}

export interface TradingPairSubscribeOptions {
  tradingPairName: string;
}

export interface TradingPairData {
  tradeId: number;
  baseAmount: number;
  quoteAmount: number;
  price: number;
  isBuy: boolean;
  occurredAt: number;
  tradingPairName: string;
}

export interface TickerData {
  data: {
    baseVolume: number;
    high: number;
    highestBid: number;
    last: number;
    lastTraded: number;
    low: number;
    lowestAsk: number;
    open: number;
    quoteVolume: number;
    tradingPairName: string;
  }[];
}

export interface GopaxWsClient {
  subscribeOpenOrders: (onMessage: (data: OpenOrdersData) => void) => () => void;
  subscribeBalances: (onMessage: (data: BalancesData) => void) => () => void;
  subscribeMyTrades: (onMessage: (data: unknown) => void) => () => void;
  subscribeOrderbook: (
    options: OrderbookSubscribeOptions,
    onMessage: (data: OrderbookData) => void,
  ) => () => void;
  subscribeTradingPair: (
    options: TradingPairSubscribeOptions,
    onMessage: (data: TradingPairData) => void,
  ) => () => void;
  subscribeTicker: (onMessage: (data: TickerData) => void) => () => void;
  onError: (handler: (error: Error) => void) => void;
  close: () => void;
}
