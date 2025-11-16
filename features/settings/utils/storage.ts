import type { Settings } from "../types";

export function loadSettings(key: string): Partial<Settings> | null {
	try {
		if (typeof window === "undefined") return null;
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as Partial<Settings>) : null;
	} catch {
		return null;
	}
}

export function saveSettings(key: string, value: Settings) {
	try {
		if (typeof window === "undefined") return;
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// ignore quota or private mode errors
	}
}
