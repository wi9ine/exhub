// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createWsConnectionFunctions } from "./ws-auth";
import type { GopaxWsClient, GopaxWsClientOptions } from "./ws-types";

export function createGopaxWsClient(options: GopaxWsClientOptions = {}): GopaxWsClient {
  const { createPublicManager, createPrivateManager } = createWsConnectionFunctions(options);

  let publicManager: ReturnType<typeof createPublicManager> | null = null;
  let privateManager: ReturnType<typeof createPrivateManager> | null = null;
  const errorHandlers: ((error: Error) => void)[] = [];

  function getPublicManager() {
    if (!publicManager) {
      publicManager = createPublicManager();
      for (const handler of errorHandlers) publicManager.onError(handler);
    }
    return publicManager;
  }

  function getPrivateManager() {
    if (!privateManager) {
      privateManager = createPrivateManager();
      for (const handler of errorHandlers) privateManager.onError(handler);
    }
    return privateManager;
  }

  return {
    subscribeOpenOrders: (onMessage) =>
      getPrivateManager().subscribe("openOrders", undefined, onMessage as (data: unknown) => void),
    subscribeBalances: (onMessage) =>
      getPrivateManager().subscribe("balances", undefined, onMessage as (data: unknown) => void),
    subscribeMyTrades: (onMessage) =>
      getPrivateManager().subscribe("myTrades", undefined, onMessage as (data: unknown) => void),
    subscribeOrderbook: (options, onMessage) =>
      getPublicManager().subscribe("orderbook", options, onMessage as (data: unknown) => void),
    subscribeTradingPair: (options, onMessage) =>
      getPublicManager().subscribe("tradingPair", options, onMessage as (data: unknown) => void),
    subscribeTicker: (onMessage) =>
      getPublicManager().subscribe("ticker", undefined, onMessage as (data: unknown) => void),
    onError: (handler) => {
      errorHandlers.push(handler);
      if (publicManager) publicManager.onError(handler);
      if (privateManager) privateManager.onError(handler);
    },
    close: () => {
      publicManager?.close();
      privateManager?.close();
      publicManager = null;
      privateManager = null;
    },
  };
}
