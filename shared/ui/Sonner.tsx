"use client";

import { useSettings } from "@features/settings/context/SettingsContext";
import { Toaster as SonnerToaster } from "sonner";

function useSonnerTheme() {
	const { settings } = useSettings();

	if (settings.themeMode === "dark") return "dark" as const;
	if (settings.themeMode === "light") return "light" as const;
	return "system" as const;
}

export function Toaster() {
	const theme = useSonnerTheme();
	return (
		<SonnerToaster
			theme={theme}
			position="top-center"
			richColors
			toastOptions={{
				className:
					"bg-background text-foreground border border-border shadow-sm rounded-lg",
			}}
		/>
	);
}
