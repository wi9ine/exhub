import type { ExHubWsManager } from "@exhub/core";
import {
  createHs256Jwt,
  createNonce,
  createWsConnection,
  createWsManager,
  resolveCredentials,
} from "@exhub/core";

import type { BithumbWsClientOptions } from "./ws-types";

const BITHUMB_WS_PUBLIC_URL = "wss://ws-api.bithumb.com/websocket/v1";
const BITHUMB_WS_PRIVATE_URL = "wss://ws-api.bithumb.com/websocket/v1/private";

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

export function createWsConnectionFunctions(options: BithumbWsClientOptions) {
  function createPublicManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: () => createWsConnection(BITHUMB_WS_PUBLIC_URL),
      matchChannel,
      buildSubscribeRequest,
    });
  }

  function createPrivateManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: async () => {
        const credentials = await resolveCredentials(options, "Bithumb");
        const nonce = createNonce();
        const token = createHs256Jwt({ api_key: credentials.apiKey, nonce }, credentials.secretKey);
        return createWsConnection(BITHUMB_WS_PRIVATE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
      },
      matchChannel,
      buildSubscribeRequest,
    });
  }

  return { createPublicManager, createPrivateManager };
}
