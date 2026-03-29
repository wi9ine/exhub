// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createWsConnectionFunctions } from "./ws-auth";
import type { UpbitWsClient, UpbitWsClientOptions } from "./ws-types";

export function createUpbitWsClient(options: UpbitWsClientOptions = {}): UpbitWsClient {
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
    subscribeTicker: (options, onMessage) =>
      getPublicManager().subscribe("ticker", options, onMessage as (data: unknown) => void),
    subscribeTrade: (options, onMessage) =>
      getPublicManager().subscribe("trade", options, onMessage as (data: unknown) => void),
    subscribeOrderbook: (options, onMessage) =>
      getPublicManager().subscribe("orderbook", options, onMessage as (data: unknown) => void),
    subscribeCandle: (options, onMessage) =>
      getPublicManager().subscribe("candle", options, onMessage as (data: unknown) => void),
    subscribeMyOrder: (options, onMessage) =>
      getPrivateManager().subscribe("myOrder", options, onMessage as (data: unknown) => void),
    subscribeMyAsset: (options, onMessage) =>
      getPrivateManager().subscribe("myAsset", options, onMessage as (data: unknown) => void),
    subscribeListSubscriptions: (options, onMessage) =>
      getPublicManager().subscribe(
        "listSubscriptions",
        options,
        onMessage as (data: unknown) => void,
      ),
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
