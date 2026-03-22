export class ExHubError extends Error {
  public readonly code: string | undefined;
  public readonly status: number | undefined;
  public readonly cause: unknown;

  public constructor(
    message: string,
    options?: { code?: string; status?: number; cause?: unknown },
  ) {
    super(message);
    this.name = "ExHubError";
    this.code = options?.code;
    this.status = options?.status;
    this.cause = options?.cause;
  }
}

export class ExHubConfigurationError extends ExHubError {
  public constructor(message: string) {
    super(message);
    this.name = "ExHubConfigurationError";
  }
}
