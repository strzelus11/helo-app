"use client";

import { Button } from "@app/components/ui/button";
import { useSettings } from "@features/settings/context/SettingsContext";
import { Monitor, Moon, SunMedium } from "lucide-react";
import { toast } from "sonner";

export function ThemeSettingsSection() {
  const { settings, setThemeMode } = useSettings();

  return (
    <section className="space-y-2">
      <p className="font-medium">Motyw</p>
      <div className="flex gap-2">
        <Button
          variant={settings.themeMode === "system" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setThemeMode("system");
            toast("Motyw ustawiony na systemowy");
          }}
        >
          <span className="flex items-center">
            <Monitor className="h-3.5 w-3.5" />
          </span>
        </Button>
        <Button
          variant={settings.themeMode === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setThemeMode("light");
            toast("Ustawiono jasny motyw");
          }}
        >
          <span className="flex items-center">
            <SunMedium className="h-3.5 w-3.5" />
          </span>
        </Button>
        <Button
          variant={settings.themeMode === "dark" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setThemeMode("dark");
            toast("Ustawiono ciemny motyw");
          }}
        >
          <span className="flex items-center">
            <Moon className="h-3.5 w-3.5" />
          </span>
        </Button>
      </div>
    </section>
  );
}
