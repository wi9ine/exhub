// 이 파일은 scripts/generate-sdk.ts로 자동 생성됩니다. 직접 수정하지 마세요.
import { createWsConnectionFunctions } from "./ws-auth";
import type { CoinoneWsClient, CoinoneWsClientOptions } from "./ws-types";

export function createCoinoneWsClient(options: CoinoneWsClientOptions = {}): CoinoneWsClient {
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
    subscribePublicOrderbook: (options, onMessage) =>
      getPublicManager().subscribe(
        "publicOrderbook",
        options,
        onMessage as (data: unknown) => void,
      ),
    subscribePublicTicker: (options, onMessage) =>
      getPublicManager().subscribe("publicTicker", options, onMessage as (data: unknown) => void),
    subscribePublicTrade: (options, onMessage) =>
      getPublicManager().subscribe("publicTrade", options, onMessage as (data: unknown) => void),
    subscribePublicChart: (options, onMessage) =>
      getPublicManager().subscribe("publicChart", options, onMessage as (data: unknown) => void),
    subscribePrivateMyOrder: (options, onMessage) =>
      getPrivateManager().subscribe(
        "privateMyOrder",
        options,
        onMessage as (data: unknown) => void,
      ),
    subscribePrivateMyAsset: (options, onMessage) =>
      getPrivateManager().subscribe(
        "privateMyAsset",
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
