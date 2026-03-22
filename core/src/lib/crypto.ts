import { createHash, createHmac, randomUUID } from "node:crypto";

function toBase64Url(input: Buffer | string): string {
  const value = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return value.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function createHs256Jwt(payload: Record<string, unknown>, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  return `${encodedHeader}.${encodedPayload}.${toBase64Url(signature)}`;
}

export function sha512Base64(message: string, secretBase64: string): string {
  const rawSecret = Buffer.from(secretBase64, "base64");
  return createHmac("sha512", rawSecret).update(message).digest("base64");
}

export function sha512Hex(message: string, secret: string): string {
  return createHmac("sha512", secret).update(message).digest("hex");
}

export function hmacSha256Hex(message: string, secret: string): string {
  return createHmac("sha256", secret).update(message).digest("hex");
}

export function sha256Hex(message: string): string {
  return createHash("sha256").update(message).digest("hex");
}

export function sha512HexDigest(message: string): string {
  return createHash("sha512").update(message).digest("hex");
}

export function createNonce(): string {
  return randomUUID();
}

export function toQueryString(input: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(input)) {
    if (rawValue === undefined || rawValue === null) continue;
    if (Array.isArray(rawValue)) {
      for (const value of rawValue) {
        params.append(key, String(value));
      }
      continue;
    }
    params.append(key, String(rawValue));
  }
  return decodeURIComponent(params.toString());
}
