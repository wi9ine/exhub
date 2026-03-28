import { ExHubConfigurationError } from "./errors";

export type ExHubCredentialProvider<TCredentials> = () => Promise<TCredentials> | TCredentials;

export interface ExHubClientOptions<TCredentials> {
  credentials?: TCredentials;
  credentialsProvider?: ExHubCredentialProvider<TCredentials>;
  baseURL?: string;
  timeout?: number;
}

export interface SignRequestInput {
  method: string;
  url: string;
  path: string;
  query?: Record<string, unknown> | undefined;
  body?: unknown | undefined;
  headers: Record<string, string>;
}

export type SignRequestHandler<TCredentials> = (
  credentials: TCredentials,
  input: SignRequestInput,
) => Promise<Record<string, string>> | Record<string, string>;

// 모든 거래소 auth.ts가 export하는 통일 인터페이스

export function resolveCredentials<T>(
  options: ExHubClientOptions<T>,
  exchangeName: string,
): Promise<T> | T {
  if (options.credentialsProvider) return options.credentialsProvider();
  if (options.credentials) return options.credentials;
  throw new ExHubConfigurationError(`${exchangeName} 인증 정보가 설정되지 않았습니다.`);
}

export type RequestPublicFn = <T>(path: string, query?: Record<string, unknown>) => Promise<T>;

export type RequestPrivateFn = <T>(config: {
  method: "GET" | "POST" | "DELETE";
  path: string;
  query?: Record<string, unknown> | undefined;
  body?: Record<string, unknown> | undefined;
}) => Promise<T>;

export interface RequestFunctions {
  requestPublic: RequestPublicFn;
  requestPrivate: RequestPrivateFn;
}
