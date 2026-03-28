import type { RequestFunctions } from "@exhub/core";
import {
  defaultHttpTransport,
  resolveBaseUrl,
  resolveCredentials,
  sha512Base64,
  toQueryString,
} from "@exhub/core";

import type { GopaxClientOptions } from "./types";

const GOPAX_DEFAULT_BASE_URL = "https://api.gopax.co.kr";

export function createRequestFunctions(options: GopaxClientOptions): RequestFunctions {
  const transport = defaultHttpTransport;
  const baseURL = resolveBaseUrl(GOPAX_DEFAULT_BASE_URL, options.baseURL);
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
    const credentials = await resolveCredentials(options, "GOPAX");
    const timestamp = String(Date.now());
    const receiveWindow = credentials.receiveWindow;
    const queryString = query ? toQueryString(query) : "";
    const includeQueryInSignature = method === "GET" && !!queryString;
    const signaturePath = includeQueryInSignature ? `${path}?${queryString}` : path;
    const bodyString = body ? JSON.stringify(body) : "";
    const message = `t${timestamp}${method}${signaturePath}${receiveWindow ? String(receiveWindow) : ""}${bodyString}`;
    const signature = sha512Base64(message, credentials.secretKey);

    return transport.request<T>({
      method,
      baseURL,
      path,
      query,
      body,
      timeout,
      headers: {
        "api-key": credentials.apiKey,
        timestamp,
        signature,
        ...(receiveWindow ? { "receive-window": String(receiveWindow) } : {}),
      },
    });
  }

  return { requestPublic, requestPrivate };
}
