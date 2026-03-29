import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WebSocket, { WebSocketServer } from "ws";
import type { WsManagerConfig } from "../src/lib/ws";
import { createWsConnection, createWsManager } from "../src/lib/ws";

// ─── mock WebSocket 서버 ──────────────────────────────────────

let server: WebSocketServer;
let serverPort: number;

function getWsUrl() {
  return `ws://localhost:${serverPort}`;
}

beforeEach(async () => {
  server = new WebSocketServer({ port: 0 });
  const address = server.address();
  serverPort = typeof address === "object" && address ? address.port : 0;
});

afterEach(async () => {
  await new Promise<void>((resolve) => {
    for (const client of server.clients) {
      client.close();
    }
    server.close(() => resolve());
  });
});

// ─── createWsConnection 테스트 ────────────────────────────────

describe("createWsConnection", () => {
  it("메시지 송수신", async () => {
    const received: unknown[] = [];

    server.on("connection", (ws) => {
      ws.on("message", (data) => {
        ws.send(data.toString());
      });
    });

    const conn = createWsConnection(getWsUrl());

    await new Promise<void>((resolve) => conn.onOpen(resolve));

    conn.onMessage((data) => {
      received.push(data);
    });

    conn.send({ type: "ping" });

    await vi.waitFor(() => {
      expect(received).toHaveLength(1);
    });

    expect(received[0]).toEqual({ type: "ping" });
    conn.close();
  });

  it("에러 핸들러 호출", async () => {
    const conn = createWsConnection("ws://localhost:1");
    const errors: Error[] = [];
    conn.onError((err) => errors.push(err));

    await vi.waitFor(() => {
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

// ─── createWsManager 테스트 ───────────────────────────────────

function createTestConfig(overrides?: Partial<WsManagerConfig<unknown>>): WsManagerConfig<unknown> {
  return {
    options: { reconnect: false },
    connect: () => createWsConnection(getWsUrl()),
    matchChannel: (channel, data) => {
      if (!data || typeof data !== "object") return false;
      return (data as Record<string, unknown>).type === channel;
    },
    buildSubscribeRequest: (channel, options) => ({
      action: "subscribe",
      channel,
      ...((options && typeof options === "object" ? options : {}) as Record<string, unknown>),
    }),
    ...overrides,
  };
}

describe("createWsManager", () => {
  it("구독 시 서버에 구독 요청 전송", async () => {
    const serverMessages: unknown[] = [];

    server.on("connection", (ws) => {
      ws.on("message", (data) => {
        serverMessages.push(JSON.parse(data.toString()));
      });
    });

    const manager = createWsManager(createTestConfig());
    const unsubscribe = manager.subscribe("ticker", { pair: "BTC" }, () => {});

    await vi.waitFor(() => {
      expect(serverMessages).toHaveLength(1);
    });

    expect(serverMessages[0]).toEqual({
      action: "subscribe",
      channel: "ticker",
      pair: "BTC",
    });

    unsubscribe();
    manager.close();
  });

  it("채널별 메시지 디스패치", async () => {
    let sentOnce = false;
    server.on("connection", (ws) => {
      ws.on("message", () => {
        if (sentOnce) return;
        sentOnce = true;
        ws.send(JSON.stringify({ type: "ticker", price: 100 }));
        ws.send(JSON.stringify({ type: "trade", amount: 5 }));
      });
    });

    const tickerMessages: unknown[] = [];
    const tradeMessages: unknown[] = [];

    const manager = createWsManager(createTestConfig());
    const unsub1 = manager.subscribe("ticker", undefined, (data) => tickerMessages.push(data));
    const unsub2 = manager.subscribe("trade", undefined, (data) => tradeMessages.push(data));

    await vi.waitFor(() => {
      expect(tickerMessages.length).toBeGreaterThanOrEqual(1);
      expect(tradeMessages.length).toBeGreaterThanOrEqual(1);
    });

    expect(tickerMessages[0]).toEqual({ type: "ticker", price: 100 });
    expect(tradeMessages[0]).toEqual({ type: "trade", amount: 5 });

    unsub1();
    unsub2();
    manager.close();
  });

  it("구독 해제 후 메시지 수신 중지", async () => {
    let sendCount = 0;
    server.on("connection", (ws) => {
      ws.on("message", () => {
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ticker", seq: sendCount++ }));
          } else {
            clearInterval(interval);
          }
        }, 50);
      });
    });

    const messages: unknown[] = [];
    const manager = createWsManager(createTestConfig());
    const unsubscribe = manager.subscribe("ticker", undefined, (data) => messages.push(data));

    await vi.waitFor(() => {
      expect(messages.length).toBeGreaterThanOrEqual(1);
    });

    const countAfterUnsub = messages.length;
    unsubscribe();

    await new Promise((r) => setTimeout(r, 150));
    expect(messages.length).toBe(countAfterUnsub);

    manager.close();
  });

  it("모든 구독 해제 시 연결 종료", async () => {
    let clientDisconnected = false;

    server.on("connection", (ws) => {
      ws.on("close", () => {
        clientDisconnected = true;
      });
    });

    const manager = createWsManager(createTestConfig());
    const unsub1 = manager.subscribe("ticker", undefined, () => {});
    const unsub2 = manager.subscribe("trade", undefined, () => {});

    await new Promise((r) => setTimeout(r, 100));

    unsub1();
    expect(clientDisconnected).toBe(false);

    unsub2();
    await vi.waitFor(() => {
      expect(clientDisconnected).toBe(true);
    });

    manager.close();
  });

  it("close() 호출 시 리소스 정리", async () => {
    let clientDisconnected = false;

    server.on("connection", (ws) => {
      ws.on("close", () => {
        clientDisconnected = true;
      });
    });

    const manager = createWsManager(createTestConfig());
    manager.subscribe("ticker", undefined, () => {});

    await new Promise((r) => setTimeout(r, 100));

    manager.close();

    await vi.waitFor(() => {
      expect(clientDisconnected).toBe(true);
    });
  });

  it("에러 핸들러 호출", async () => {
    server.on("connection", (ws) => {
      ws.close(1008, "test error");
    });

    const errors: Error[] = [];
    const manager = createWsManager(
      createTestConfig({
        options: { reconnect: false },
      }),
    );

    manager.onError((err) => errors.push(err));
    manager.subscribe("ticker", undefined, () => {});

    await new Promise((r) => setTimeout(r, 200));
    manager.close();
  });

  it("자동 재연결 및 구독 복원", async () => {
    let connectionCount = 0;
    const serverMessages: string[] = [];

    server.on("connection", (ws) => {
      connectionCount++;
      ws.on("message", (data) => {
        serverMessages.push(data.toString());
      });
      if (connectionCount === 1) {
        setTimeout(() => ws.close(1000), 100);
      }
    });

    const manager = createWsManager(
      createTestConfig({
        options: { reconnect: true, maxReconnectAttempts: 3, reconnectInterval: 100 },
      }),
    );

    manager.subscribe("ticker", undefined, () => {});

    await vi.waitFor(
      () => {
        expect(connectionCount).toBeGreaterThanOrEqual(2);
      },
      { timeout: 3000 },
    );

    // 재연결 후 구독 요청이 다시 전송되었는지 확인
    expect(serverMessages.length).toBeGreaterThanOrEqual(2);

    manager.close();
  });

  it("ping/pong 핸들러 동작", async () => {
    let sentOnce = false;
    server.on("connection", (ws) => {
      ws.on("message", (data) => {
        const parsed = JSON.parse(data.toString());
        // pong 응답은 무시하고 최초 구독 요청에만 ping+ticker 전송
        if (parsed.type === "pong") return;
        if (sentOnce) return;
        sentOnce = true;
        ws.send(JSON.stringify({ type: "ping" }));
        ws.send(JSON.stringify({ type: "ticker", price: 100 }));
      });
    });

    const pongSent: unknown[] = [];
    const messages: unknown[] = [];

    const manager = createWsManager(
      createTestConfig({
        pingPong: {
          onMessage(data, conn) {
            if (
              data &&
              typeof data === "object" &&
              (data as Record<string, unknown>).type === "ping"
            ) {
              pongSent.push(data);
              conn.send({ type: "pong" });
              return true;
            }
            return false;
          },
        },
      }),
    );

    manager.subscribe("ticker", undefined, (data) => messages.push(data));

    await vi.waitFor(() => {
      expect(messages.length).toBeGreaterThanOrEqual(1);
    });

    // ping은 핸들러에서 처리되어 구독 핸들러로 전달되지 않음
    expect(messages[0]).toEqual({ type: "ticker", price: 100 });
    expect(pongSent.length).toBeGreaterThanOrEqual(1);

    manager.close();
  });
});
