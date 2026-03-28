import type { RequestFunctions } from "@exhub/core";
import {
  defaultHttpTransport,
  hmacSha256Hex,
  resolveBaseUrl,
  resolveCredentials,
  toQueryString,
} from "@exhub/core";

import type { KorbitClientOptions } from "./types";

const KORBIT_DEFAULT_BASE_URL = "https://api.korbit.co.kr";

export function createRequestFunctions(options: KorbitClientOptions): RequestFunctions {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(KORBIT_DEFAULT_BASE_URL, options.baseURL);
  const timeout = options.timeout ?? 10_000;

  function requestPublic<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    return transport.request<T>({
      method: "GET",
      baseURL,
      path,
      query,
      timeout,
    });
  }

  async function requestPrivate<T>(config: {
    method: "GET" | "POST" | "DELETE";
    path: string;
    query?: Record<string, unknown> | undefined;
    body?: Record<string, unknown> | undefined;
  }): Promise<T> {
    const { method, path, query, body } = config;
    const credentials = await resolveCredentials(options, "Korbit");
    const timestamp = Date.now();
    const recvWindow = credentials.recvWindow ?? 5_000;

    if (method === "POST") {
      const unsignedParams = body ? { ...body, timestamp, recvWindow } : { timestamp, recvWindow };
      const signature = hmacSha256Hex(toQueryString(unsignedParams), credentials.secretKey);

      return transport.request<T>({
        method: "POST",
        baseURL,
        path,
        body: { ...unsignedParams, signature },
        timeout,
        headers: {
          "X-KAPI-KEY": credentials.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    }

    const unsignedParams = query ? { ...query, timestamp, recvWindow } : { timestamp, recvWindow };
    const signature = hmacSha256Hex(toQueryString(unsignedParams), credentials.secretKey);

    return transport.request<T>({
      method,
      baseURL,
      path,
      query: { ...unsignedParams, signature },
      timeout,
      headers: { "X-KAPI-KEY": credentials.apiKey },
    });
  }

  return { requestPublic, requestPrivate };
}
