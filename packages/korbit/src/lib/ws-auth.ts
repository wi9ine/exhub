import type { ExHubWsManager } from "@exhub/core";
import {
  createWsConnection,
  createWsManager,
  hmacSha256Hex,
  resolveCredentials,
  toQueryString,
} from "@exhub/core";

import type { KorbitWsClientOptions } from "./ws-types";

const KORBIT_WS_PUBLIC_URL = "wss://ws-api.korbit.co.kr/v2/public";
const KORBIT_WS_PRIVATE_URL = "wss://ws-api.korbit.co.kr/v2/private";

function buildSubscribeRequest(channel: string, options: unknown): unknown {
  const request: Record<string, unknown> = {
    method: "subscribe",
    type: channel,
  };
  if (options && typeof options === "object") {
    Object.assign(request, options);
  }
  return [request];
}

function matchChannel(channel: string, data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  // Korbit은 type 필드 또는 channelType 필드로 채널을 식별
  return record.type === channel || record.channelType === channel;
}

export function createWsConnectionFunctions(options: KorbitWsClientOptions) {
  function createPublicManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: () => createWsConnection(KORBIT_WS_PUBLIC_URL),
      matchChannel,
      buildSubscribeRequest,
    });
  }

  function createPrivateManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: async () => {
        const credentials = await resolveCredentials(options, "Korbit");
        const timestamp = Date.now();
        const params = { timestamp };
        const signature = hmacSha256Hex(toQueryString(params), credentials.secretKey);
        const url = `${KORBIT_WS_PRIVATE_URL}?timestamp=${timestamp}&signature=${signature}`;
        return createWsConnection(url, {
          headers: { "X-KAPI-KEY": credentials.apiKey },
        });
      },
      matchChannel,
      buildSubscribeRequest,
    });
  }

  return { createPublicManager, createPrivateManager };
}
