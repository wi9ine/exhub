import type { ExHubWsManager } from "@exhub/core";
import {
  createHs256Jwt,
  createNonce,
  createWsConnection,
  createWsManager,
  resolveCredentials,
} from "@exhub/core";

import type { UpbitWsClientOptions } from "./ws-types";

const UPBIT_WS_PUBLIC_URL = "wss://api.upbit.com/websocket/v1";
const UPBIT_WS_PRIVATE_URL = "wss://api.upbit.com/websocket/v1/private";

function buildSubscribeRequest(channel: string, options: unknown): unknown {
  const ticket = { ticket: createNonce() };
  const typeObj: Record<string, unknown> = { type: channel };
  if (options && typeof options === "object") {
    Object.assign(typeObj, options);
  }
  return [ticket, typeObj];
}

function matchChannel(channel: string, data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  return record.type === channel;
}

export function createWsConnectionFunctions(options: UpbitWsClientOptions) {
  function createPublicManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: () => createWsConnection(UPBIT_WS_PUBLIC_URL),
      matchChannel,
      buildSubscribeRequest,
    });
  }

  function createPrivateManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: async () => {
        const credentials = await resolveCredentials(options, "Upbit");
        const nonce = createNonce();
        const token = createHs256Jwt(
          { access_key: credentials.accessKey, nonce },
          credentials.secretKey,
        );
        return createWsConnection(UPBIT_WS_PRIVATE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
      },
      matchChannel,
      buildSubscribeRequest,
    });
  }

  return { createPublicManager, createPrivateManager };
}
