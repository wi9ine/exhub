import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { UpbitWsClient } from "../src";
import { createUpbitWsClient } from "../src";

let ws: UpbitWsClient;

describe("@exhub/upbit ws integration", () => {
  beforeAll(() => {
    ws = createUpbitWsClient({ reconnect: false });
  });

  afterAll(() => {
    ws.close();
  });

  it("ticker 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeTicker({ type: "ticker", codes: ["KRW-BTC"] }, (data) => {
      messages.push(data);
    });

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
    expect(first.code).toBe("KRW-BTC");
    expect(first.trade_price).toBeTypeOf("number");
  }, 15_000);

  it("orderbook 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeOrderbook({ type: "orderbook", codes: ["KRW-BTC"] }, (data) => {
      messages.push(data);
    });

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
    expect(first.code).toBe("KRW-BTC");
    expect(Array.isArray(first.orderbook_units)).toBe(true);
  }, 15_000);
});
