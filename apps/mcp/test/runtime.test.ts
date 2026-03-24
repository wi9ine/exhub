import { describe, expect, it } from "vitest";

import { resolveTools } from "../src/runtime";
import type { ToolMetadata } from "../src/types";

function tool(
  category: string,
  method: string,
  access: "public" | "private" = "public",
): ToolMetadata {
  return { category, method, access, args: [] };
}

describe("resolveTools", () => {
  it("method 이름이 고유하면 method를 그대로 도구명으로 사용한다", () => {
    const result = resolveTools([tool("market", "tickers"), tool("market", "orderbook")]);

    expect(result.map((t) => t.name)).toEqual(["tickers", "orderbook"]);
  });

  it("method 이름이 중복되면 category.method 형태로 구분한다", () => {
    const result = resolveTools([tool("market", "getOrder"), tool("orders", "getOrder")]);

    expect(result.map((t) => t.name)).toEqual(["market.getOrder", "orders.getOrder"]);
  });

  it("최종 도구명이 중복되면 에러를 throw한다", () => {
    // 같은 category + 같은 method → category.method도 동일
    expect(() => resolveTools([tool("market", "tickers"), tool("market", "tickers")])).toThrow(
      "도구 이름이 중복됩니다: market.tickers",
    );
  });

  it("빈 배열을 전달하면 빈 결과를 반환한다", () => {
    expect(resolveTools([])).toEqual([]);
  });
});
