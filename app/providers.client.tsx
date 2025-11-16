"use client";

import { SettingsProvider } from "@features/settings/context/SettingsContext";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@shared/ui/Sonner";

export function AppClientProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SettingsProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<Toaster />
				{children}
			</ThemeProvider>
		</SettingsProvider>
	);
}
