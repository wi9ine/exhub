import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { GopaxWsClient } from "../src";
import { createGopaxWsClient } from "../src";

let ws: GopaxWsClient;

describe("@exhub/gopax ws integration", () => {
  beforeAll(() => {
    ws = createGopaxWsClient({ reconnect: false });
  });

  afterAll(() => {
    ws.close();
  });

  it("ticker 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeTicker((data) => {
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
    expect(first.n).toBe("ticker");
    expect(first.o).toBeTypeOf("object");
  }, 15_000);

  it("orderbook 구독 및 데이터 수신", async () => {
    const messages: unknown[] = [];

    const unsubscribe = ws.subscribeOrderbook({ tradingPairName: "BTC-KRW" }, (data) => {
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
    expect(first.n).toBe("orderbook");
    expect(first.o).toBeTypeOf("object");
  }, 15_000);
});
