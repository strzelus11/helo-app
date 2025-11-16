"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
	Settings,
	DEFAULT_SETTINGS,
	STORAGE_KEY,
	ThemeMode,
	Language,
} from "../types";
import { loadSettings, saveSettings } from "../utils/storage";

type SettingsCtx = {
	settings: Settings;
	setSettings: React.Dispatch<React.SetStateAction<Settings>>;
	setThemeMode: (mode: ThemeMode) => void;
	toggleDark: () => void;
	setLanguage: (language: Language) => void;
};

const Ctx = createContext<SettingsCtx | null>(null);

export function useSettings(): SettingsCtx {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("SettingsContext: missing provider");
	return ctx;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	// Single source of truth: everything in one localStorage key (STORAGE_KEY)
	const [settings, setSettings] = useState<Settings>(() => {
		if (typeof window === "undefined") {
			return DEFAULT_SETTINGS;
		}

		// Load previously saved settings object (themeMode + language, etc.)
		const stored = loadSettings(STORAGE_KEY) as Partial<Settings> | null;

		// Optional one-time migration from legacy localStorage.theme
		const legacyTheme = window.localStorage.getItem("theme") as
			| "light"
			| "dark"
			| null;

		return {
			...DEFAULT_SETTINGS,
			...(stored ?? {}),
			...(legacyTheme ? { themeMode: legacyTheme } : {}),
		};
	});

	// Persist whole settings object to localStorage whenever it changes
	useEffect(() => {
		saveSettings(STORAGE_KEY, settings);
	}, [settings]);

	// Apply <html> class + keep localStorage.theme in sync (for inline theme script)
	useEffect(() => {
		if (typeof document === "undefined" || typeof window === "undefined") {
			return;
		}

		const root = document.documentElement;

		if (settings.themeMode === "system") {
			root.classList.remove("light", "dark");
			window.localStorage.removeItem("theme");
			return;
		}

		const isDark = settings.themeMode === "dark";

		if (isDark) {
			root.classList.add("dark");
			root.classList.remove("light");
			window.localStorage.setItem("theme", "dark");
		} else {
			root.classList.add("light");
			root.classList.remove("dark");
			window.localStorage.setItem("theme", "light");
		}
	}, [settings.themeMode]);

	const api = useMemo<SettingsCtx>(
		() => ({
			settings,
			setSettings,
			setThemeMode: (mode) =>
				setSettings((s) => ({
					...s,
					themeMode: mode,
				})),
			toggleDark: () =>
				setSettings((s) => ({
					...s,
					themeMode: s.themeMode === "dark" ? "light" : "dark",
				})),
			setLanguage: (language) =>
				setSettings((s) => ({
					...s,
					language,
				})),
		}),
		[settings]
	);

	return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
