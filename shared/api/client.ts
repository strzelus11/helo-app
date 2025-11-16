import { z } from "zod";
import { InvalidDataError, NetworkError } from "@shared/lib/errors";

export async function apiFetch<T>(
	url: string,
	schema: z.ZodType<T>,
	opts: { timeoutMs?: number; retries?: number; init?: RequestInit } = {}
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
		} catch (e: any) {
			if (attempt === retries) {
				if (e?.name === "AbortError") throw new NetworkError("Request timeout");
				if (e instanceof z.ZodError)
					throw new InvalidDataError(e.message, e.flatten());
				throw e;
			}
		}
	}
	throw new NetworkError("Unreachable");
}
