import { InvalidDataError, NetworkError } from "@shared/lib/errors";
import { z } from "zod";

export async function apiFetch<T>(
  url: string,
  schema: z.ZodType<T>,
  opts: { timeoutMs?: number; retries?: number; init?: RequestInit } = {},
): Promise<T> {
  const { timeoutMs = 8000, retries = 1, init } = opts;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      clearTimeout(to);
      if (!res.ok) throw new NetworkError(`HTTP ${res.status}`);
      const json = await res.json();
      return schema.parse(json);
    } catch (e: unknown) {
      if (attempt === retries) {
        // Timeout / abort
        if (e instanceof DOMException && e.name === "AbortError") {
          throw new NetworkError("Request timeout");
        }

        // Zod validation error
        if (e instanceof z.ZodError) {
          throw new InvalidDataError(e.message, e.flatten());
        }

        // Fallback: rethrow whatever error we got
        throw e;
      }
    }
  }
  throw new NetworkError("Unreachable");
}
