import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { KorbitWsClient } from "../src";
import { createKorbitWsClient } from "../src";

let ws: KorbitWsClient;

describe("@exhub/korbit ws integration", () => {
  beforeAll(() => {
    ws = createKorbitWsClient({ reconnect: false });
  });

  afterAll(() => {
    ws.close();
  });

  it("ticker 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeTicker(
      { method: "subscribe", type: "ticker", symbols: ["btc_krw"] },
      (data) => {
        messages.push(data);
      },
    );

    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (messages.length >= 1) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        resolve();
      }, 10_000);
    });

    unsubscribe();

    expect(messages.length).toBeGreaterThanOrEqual(1);
    const first = messages[0] as Record<string, unknown>;
    expect(first.type).toBe("ticker");
    expect(first.data).toBeTypeOf("object");
  }, 15_000);

  it("orderbook 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeOrderbook(
      { method: "subscribe", type: "orderbook", symbols: ["btc_krw"] },
      (data) => {
        messages.push(data);
      },
    );

    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (messages.length >= 1) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        resolve();
      }, 10_000);
    });

    unsubscribe();

    expect(messages.length).toBeGreaterThanOrEqual(1);
    const first = messages[0] as Record<string, unknown>;
    expect(first.type).toBe("orderbook");
    expect(first.data).toBeTypeOf("object");
  }, 15_000);
});
