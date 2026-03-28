import type { RequestFunctions } from "@exhub/core";
import {
  createNonce,
  defaultHttpTransport,
  resolveBaseUrl,
  resolveCredentials,
  sha512Hex,
} from "@exhub/core";

import type {
  CoinoneClientOptions,
  CoinoneCredentials,
  CreateCoinoneSignedBodyInput,
} from "./types";

const COINONE_DEFAULT_BASE_URL = "https://api.coinone.co.kr";

export function createCoinoneSignedBody<TBody extends CreateCoinoneSignedBodyInput>(
  credentials: CoinoneCredentials,
  body?: TBody,
) {
  return {
    access_token: credentials.accessToken,
    nonce: createNonce(),
    ...(body ?? {}),
  };
}

export function createCoinoneHeaders(
  credentials: CoinoneCredentials,
  payload: Record<string, unknown>,
) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
  return {
    "Content-Type": "application/json",
    "X-COINONE-PAYLOAD": encodedPayload,
    "X-COINONE-SIGNATURE": sha512Hex(encodedPayload, credentials.secretKey),
  };
}

export function createRequestFunctions(options: CoinoneClientOptions): RequestFunctions {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(COINONE_DEFAULT_BASE_URL, options.baseURL);
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
    const { path, body } = config;
    const credentials = await resolveCredentials(options, "Coinone");
    const requestBody = createCoinoneSignedBody(credentials, body);
    const headers = createCoinoneHeaders(credentials, requestBody);

    return transport.request<T>({
      method: "POST",
      baseURL,
      path,
      body: requestBody,
      timeout,
      headers,
    });
  }

  return { requestPublic, requestPrivate };
}
