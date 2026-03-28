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

import type { UpbitClientOptions } from "./types";

const UPBIT_DEFAULT_BASE_URL = "https://api.upbit.com/v1";

export function createRequestFunctions(options: UpbitClientOptions): RequestFunctions {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(UPBIT_DEFAULT_BASE_URL, options.baseURL);
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
    const credentials = await resolveCredentials(options, "Upbit");
    const nonce = createNonce();
    const tokenPayload = {
      access_key: credentials.accessKey,
      nonce,
    };
    const payload = body ?? query;
    const queryString = payload ? toQueryString(payload) : "";
    const signedPayload =
      queryString.length > 0
        ? {
            ...tokenPayload,
            query_hash: sha512HexDigest(queryString),
            query_hash_alg: "SHA512",
          }
        : tokenPayload;

    return transport.request<T>({
      method,
      baseURL,
      path,
      query,
      body,
      timeout,
      headers: {
        Authorization: `Bearer ${createHs256Jwt(signedPayload, credentials.secretKey)}`,
        Accept: "application/json",
      },
    });
  }

  return { requestPublic, requestPrivate };
}
