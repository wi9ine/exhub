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
