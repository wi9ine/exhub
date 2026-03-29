import WebSocket from "ws";
import type { ExHubCredentialProvider } from "./types";

// ─── WebSocket 클라이언트 옵션 ─────────────────────────────────

export interface ExHubWsClientOptions<TCredentials> {
  credentials?: TCredentials;
  credentialsProvider?: ExHubCredentialProvider<TCredentials>;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
}

const WS_DEFAULTS = {
  reconnect: true,
  maxReconnectAttempts: 5,
  reconnectInterval: 1000,
  maxReconnectInterval: 30_000,
} as const;

// ─── WebSocket 연결 인터페이스 ─────────────────────────────────

export type WsMessageHandler = (data: unknown) => void;
export type WsErrorHandler = (error: Error) => void;
export type WsCloseHandler = (code: number, reason: string) => void;
export type WsOpenHandler = () => void;

export interface ExHubWsConnection {
  send(data: unknown): void;
  close(): void;
  readonly readyState: number;
}

// ─── 구독 관리 ─────────────────────────────────────────────────

interface Subscription {
  id: string;
  channel: string;
  request: unknown;
  handler: WsMessageHandler;
}

export interface ExHubWsManager {
  subscribe(channel: string, options: unknown, handler: WsMessageHandler): () => void;
  onError(handler: WsErrorHandler): void;
  close(): void;
}

// ─── ping/pong 핸들러 ──────────────────────────────────────────

export interface PingPongHandler {
  onMessage?(data: unknown, ws: ExHubWsConnection): boolean;
  startPing?(ws: ExHubWsConnection): () => void;
}

// ─── WebSocket 연결 생성 ───────────────────────────────────────

export function createWsConnection(
  url: string,
  options?: { headers?: Record<string, string> },
): ExHubWsConnection & {
  onMessage(handler: WsMessageHandler): void;
  onError(handler: WsErrorHandler): void;
  onClose(handler: WsCloseHandler): void;
  onOpen(handler: WsOpenHandler): void;
} {
  const ws = new WebSocket(url, { headers: options?.headers });

  return {
    send(data: unknown) {
      ws.send(typeof data === "string" ? data : JSON.stringify(data));
    },
    close() {
      ws.close();
    },
    get readyState() {
      return ws.readyState;
    },
    onMessage(handler: WsMessageHandler) {
      ws.on("message", (raw: WebSocket.RawData) => {
        try {
          const parsed = JSON.parse(raw.toString());
          handler(parsed);
        } catch {
          handler(raw.toString());
        }
      });
    },
    onError(handler: WsErrorHandler) {
      ws.on("error", handler);
    },
    onClose(handler: WsCloseHandler) {
      ws.on("close", (code: number, reason: Buffer) => {
        handler(code, reason.toString());
      });
    },
    onOpen(handler: WsOpenHandler) {
      ws.on("open", handler);
    },
  };
}

// ─── WebSocket 매니저 (구독 관리 + 자동 재연결) ────────────────

export interface WsManagerConfig<TCredentials> {
  options: ExHubWsClientOptions<TCredentials>;
  connect: () =>
    | ReturnType<typeof createWsConnection>
    | Promise<ReturnType<typeof createWsConnection>>;
  matchChannel: (channel: string, data: unknown) => boolean;
  buildSubscribeRequest: (channel: string, options: unknown) => unknown;
  pingPong?: PingPongHandler;
}

export function createWsManager<TCredentials>(
  config: WsManagerConfig<TCredentials>,
): ExHubWsManager {
  const reconnect = config.options.reconnect ?? WS_DEFAULTS.reconnect;
  const maxAttempts = config.options.maxReconnectAttempts ?? WS_DEFAULTS.maxReconnectAttempts;
  const baseInterval = config.options.reconnectInterval ?? WS_DEFAULTS.reconnectInterval;

  let ws: ReturnType<typeof createWsConnection> | null = null;
  let destroyed = false;
  let reconnectAttempt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let stopPing: (() => void) | null = null;

  const subscriptions = new Map<string, Subscription>();
  const errorHandlers: WsErrorHandler[] = [];
  let subIdCounter = 0;

  function emitError(error: Error) {
    for (const handler of errorHandlers) {
      handler(error);
    }
  }

  function dispatchMessage(data: unknown) {
    for (const sub of subscriptions.values()) {
      if (config.matchChannel(sub.channel, data)) {
        sub.handler(data);
      }
    }
  }

  async function connectAndListen() {
    if (destroyed) return;

    try {
      ws = await config.connect();
    } catch (err) {
      emitError(err instanceof Error ? err : new Error(String(err)));
      scheduleReconnect();
      return;
    }

    ws.onOpen(() => {
      reconnectAttempt = 0;

      if (config.pingPong?.startPing && ws) {
        stopPing = config.pingPong.startPing(ws);
      }

      for (const sub of subscriptions.values()) {
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(sub.request);
        }
      }
    });

    ws.onMessage((data: unknown) => {
      if (ws && config.pingPong?.onMessage?.(data, ws)) return;
      dispatchMessage(data);
    });

    ws.onError((err: Error) => {
      emitError(err);
    });

    ws.onClose((_code: number, _reason: string) => {
      cleanup();
      scheduleReconnect();
    });
  }

  function cleanup() {
    if (stopPing) {
      stopPing();
      stopPing = null;
    }
  }

  function scheduleReconnect() {
    if (destroyed || !reconnect) return;
    if (reconnectAttempt >= maxAttempts) {
      emitError(new Error(`최대 재연결 시도 횟수(${maxAttempts})를 초과했습니다.`));
      return;
    }

    const delay = Math.min(baseInterval * 2 ** reconnectAttempt, WS_DEFAULTS.maxReconnectInterval);
    reconnectAttempt++;

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connectAndListen();
    }, delay);
  }

  return {
    subscribe(channel: string, options: unknown, handler: WsMessageHandler): () => void {
      const id = String(++subIdCounter);
      const request = config.buildSubscribeRequest(channel, options);
      const subscription: Subscription = { id, channel, request, handler };
      subscriptions.set(id, subscription);

      if (!ws) {
        connectAndListen();
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.send(request);
      }

      return () => {
        subscriptions.delete(id);
        if (subscriptions.size === 0) {
          cleanup();
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
          }
          if (ws) {
            ws.close();
            ws = null;
          }
        }
      };
    },

    onError(handler: WsErrorHandler) {
      errorHandlers.push(handler);
    },

    close() {
      destroyed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      cleanup();
      if (ws) {
        ws.close();
        ws = null;
      }
      subscriptions.clear();
      errorHandlers.length = 0;
    },
  };
}
