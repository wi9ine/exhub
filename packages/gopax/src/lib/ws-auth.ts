import type { ExHubWsConnection, ExHubWsManager, PingPongHandler } from "@exhub/core";
import { createWsConnection, createWsManager, resolveCredentials, sha512Base64 } from "@exhub/core";

import type { GopaxWsClientOptions } from "./ws-types";

const GOPAX_WS_URL = "wss://wsapi.gopax.co.kr";

/** Gopax는 primus 프레임워크 기반 커스텀 ping/pong 사용 */
const gopaxPingPong: PingPongHandler = {
  onMessage(data: unknown, ws: ExHubWsConnection): boolean {
    if (typeof data === "string" && data.includes("primus::ping")) {
      ws.send('"primus::pong"');
      return true;
    }
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if (record.n === "primus::ping") {
        ws.send(JSON.stringify({ n: "primus::pong" }));
        return true;
      }
    }
    return false;
  },
};

function buildSubscribeRequest(channel: string, options: unknown): unknown {
  const request: Record<string, unknown> = { n: channel };
  if (options && typeof options === "object") {
    request.o = options;
  } else {
    request.o = {};
  }
  return request;
}

function matchChannel(channel: string, data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  return record.n === channel;
}

export function createWsConnectionFunctions(options: GopaxWsClientOptions) {
  function createPublicManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: () => createWsConnection(GOPAX_WS_URL),
      matchChannel,
      buildSubscribeRequest,
      pingPong: gopaxPingPong,
    });
  }

  function createPrivateManager(): ExHubWsManager {
    return createWsManager({
      options,
      connect: async () => {
        const credentials = await resolveCredentials(options, "GOPAX");
        const timestamp = String(Date.now());
        const message = `t${timestamp}`;
        const signature = sha512Base64(message, credentials.secretKey);
        const url = `${GOPAX_WS_URL}?apiKey=${credentials.apiKey}&timestamp=${timestamp}&signature=${encodeURIComponent(signature)}`;
        return createWsConnection(url);
      },
      matchChannel,
      buildSubscribeRequest,
      pingPong: gopaxPingPong,
    });
  }

  return { createPublicManager, createPrivateManager };
}
