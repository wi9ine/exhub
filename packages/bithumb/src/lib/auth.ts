import type { RequestFunctions } from "@exhub/core";
import {
  createHs256Jwt,
  createNonce,
  defaultHttpTransport,
  resolveBaseUrl,
  resolveCredentials,
  sha512HexDigest,
  toQueryString,
} from "@exhub/core";

import type { BithumbClientOptions } from "./types";

const BITHUMB_DEFAULT_BASE_URL = "https://api.bithumb.com";

export function createRequestFunctions(options: BithumbClientOptions): RequestFunctions {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(BITHUMB_DEFAULT_BASE_URL, options.baseURL);
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
    // Bithumb은 body를 query로 전달 (기존 동작 유지)
    const params = body ?? query;
    const credentials = await resolveCredentials(options, "Bithumb");
    const queryString = params ? toQueryString(params) : "";
    const tokenPayload = {
      access_key: credentials.apiKey,
      nonce: createNonce(),
      timestamp: Date.now(),
      ...(queryString
        ? {
            query_hash: sha512HexDigest(queryString),
            query_hash_alg: "SHA512",
          }
        : {}),
    };

    return transport.request<T>({
      method,
      baseURL,
      path,
      query: params,
      timeout,
      headers: {
        Authorization: `Bearer ${createHs256Jwt(tokenPayload, credentials.secretKey)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  return { requestPublic, requestPrivate };
}
