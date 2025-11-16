export type ThemeMode = "light" | "dark" | "system";
export type Language = "en" | "pl";

export type Settings = {
	themeMode: ThemeMode;
	language: Language;
};

export const DEFAULT_SETTINGS: Settings = {
	themeMode: "system",
	language: "en",
};

export const STORAGE_KEY = "helo.settings.v1";
