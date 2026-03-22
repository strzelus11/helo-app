"use client";

import { MapProvider } from "@features/map/context/MapContext";
import { NavigationProvider } from "@features/navigation/context/NavigationContext";
import { SearchProvider } from "@features/searchbar/context/SearchContext";
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
        <MapProvider>
          <NavigationProvider>
            <SearchProvider>
              <Toaster />
              {children}
            </SearchProvider>
          </NavigationProvider>
        </MapProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
