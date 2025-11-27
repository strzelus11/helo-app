"use client";

import { SettingsProvider } from "@features/settings/context/SettingsContext";
import { Toaster } from "@shared/ui/Sonner";

import { ThemeProvider } from "./components/theme-provider";

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
