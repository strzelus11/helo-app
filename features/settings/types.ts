export type ThemeMode = "light" | "dark" | "system";
export type Language = "en" | "pl";
export type TextSize = "small" | "medium" | "large";

export type Settings = {
	themeMode: ThemeMode;
    language: Language;
    textSize: TextSize;
    voiceEnabled: boolean;
    orientationEnabled: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
	themeMode: "system",
	language: "en",
	textSize: "medium",
	voiceEnabled: false,
	orientationEnabled: false,
};

export const STORAGE_KEY = "helo.settings.v1";
