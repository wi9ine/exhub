import type { AxiosRequestConfig } from "axios";
import axios from "axios";

export type ExHubHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ExHubHttpRequest {
  method: ExHubHttpMethod;
  baseURL: string;
  path: string;
  query?: Record<string, unknown> | undefined;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ExHubHttpTransport {
  request<TResponse>(request: ExHubHttpRequest): Promise<TResponse>;
}

export function createAxiosHttpTransport(): ExHubHttpTransport {
  return {
    async request<TResponse>(request: ExHubHttpRequest): Promise<TResponse> {
      const config: AxiosRequestConfig = {
        method: request.method,
        baseURL: request.baseURL,
        url: request.path,
        ...(request.query ? { params: request.query } : {}),
        ...(request.body !== undefined ? { data: request.body } : {}),
        ...(request.headers ? { headers: request.headers } : {}),
        ...(request.timeout !== undefined ? { timeout: request.timeout } : {}),
      };
      const response = await axios.request<TResponse>(config);

      return response.data;
    },
  };
}

export const defaultHttpTransport = createAxiosHttpTransport();
