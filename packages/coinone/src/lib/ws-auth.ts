import type { ExHubWsManager } from "@exhub/core";
import { createWsConnection, createWsManager, resolveCredentials, sha512Hex } from "@exhub/core";

import type { CoinoneWsClientOptions } from "./ws-types";

const COINONE_WS_PUBLIC_URL = "wss://stream.coinone.co.kr";
const COINONE_WS_PRIVATE_URL = "wss://stream.coinone.co.kr/v1/private";

function buildSubscribeRequest(channel: string, options: unknown): unknown {
  const payload: Record<string, unknown> = {
    request_type: "SUBSCRIBE",
    channel: channel.toUpperCase(),
  };
  if (options && typeof options === "object") {
    Object.assign(payload, options);
  }
  return payload;
}

function matchChannel(channel: string, data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  const responseType = record.response_type;
  if (typeof responseType !== "string") return false;
  // public/private 접두사를 제거하여 API 채널명과 매칭 (publicTicker → TICKER)
  const apiChannel = channel.replace(/^(public|private)/i, "").toUpperCase();
  return responseType === "DATA" && record.channel === apiChannel;
}

export function createWsConnectionFunctions(options: CoinoneWsClientOptions) {
  function createPublicManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: () => createWsConnection(COINONE_WS_PUBLIC_URL),
      matchChannel,
      buildSubscribeRequest,
    });
  }

  function createPrivateManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: async () => {
        const credentials = await resolveCredentials(options, "Coinone");
        const payload = Buffer.from(JSON.stringify({})).toString("base64");
        const signature = sha512Hex(payload, credentials.secretKey);
        return createWsConnection(COINONE_WS_PRIVATE_URL, {
          headers: {
            "X-COINONE-PAYLOAD": payload,
            "X-COINONE-SIGNATURE": signature,
          },
        });
      },
      matchChannel,
      buildSubscribeRequest,
    });
  }

  return { createPublicManager, createPrivateManager };
}
