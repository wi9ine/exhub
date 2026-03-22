export function resolveBaseUrl(defaultBaseUrl: string, override?: string): string {
  return override ?? defaultBaseUrl;
}
