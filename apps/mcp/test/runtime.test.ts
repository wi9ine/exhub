import { describe, expect, it } from "vitest";

import { requireNamedValidator, resolveTools } from "../src/runtime";
import type { ToolMetadata } from "../src/types";

function tool(
  category: string,
  method: string,
  access: "public" | "private" = "public",
  overrides: Partial<ToolMetadata> = {},
): ToolMetadata {
  return { category, method, access, args: [], ...overrides };
}

describe("resolveTools", () => {
  it("method 이름이 고유하면 method를 그대로 도구명으로 사용한다", () => {
    const result = resolveTools("upbit", [tool("market", "tickers"), tool("market", "orderbook")]);

    expect(result.map((t) => t.name)).toEqual(["tickers", "orderbook"]);
  });

  it("method 이름이 중복되면 category_method 형태로 구분한다", () => {
    const result = resolveTools("upbit", [tool("market", "getOrder"), tool("orders", "getOrder")]);

    expect(result.map((t) => t.name)).toEqual(["market_getOrder", "orders_getOrder"]);
  });

  it("최종 도구명이 중복되면 에러를 throw한다", () => {
    // 같은 category + 같은 method → category_method도 동일
    expect(() =>
      resolveTools("upbit", [tool("market", "tickers"), tool("market", "tickers")]),
    ).toThrow("도구 이름이 중복됩니다: market_tickers");
  });

  it("빈 배열을 전달하면 빈 결과를 반환한다", () => {
    expect(resolveTools("upbit", [])).toEqual([]);
  });

  it("specOperationId가 있으면 스펙 summary를 description으로 채운다", () => {
    const [resolved] = resolveTools("upbit", [
      tool("tickers", "listTickers", "public", { specOperationId: "list_tickers" }),
    ]);

    if (!resolved) {
      throw new Error("resolved tool이 없습니다.");
    }
    expect(resolved.description).toBe(
      "지정한 페어의 현재가를 조회합니다. 요청 시점 기준으로 해당 페어의 티커 스냅샷이 반환됩니다.",
    );
  });

  it("spec summary를 찾지 못하면 description을 비워 둔다", () => {
    const [resolved] = resolveTools("upbit", [
      tool("tickers", "listTickers", "public", { specOperationId: "missing_spec_id" }),
    ]);

    if (!resolved) {
      throw new Error("resolved tool이 없습니다.");
    }
    expect(resolved.description).toBeUndefined();
  });

  it("연결된 validator 이름이 잘못되면 즉시 에러를 throw한다", () => {
    expect(() => requireNamedValidator({}, "MissingValidator")).toThrow(
      "generated-zod validator를 찾지 못했습니다",
    );
  });
});
