"use client";

import { Button } from "@app/components/ui/button";
import { useSettings } from "@features/settings/context/SettingsContext";
import { AArrowUp, AArrowDown, ALargeSmall } from "lucide-react";
import { toast } from "sonner";

export function TextSizeSettingsSection() {
  const { settings, setTextSize } = useSettings();

  return (
    <section className="space-y-2">
      <p className="font-medium">Rozmiar tekstu</p>
      <div className="flex gap-2">
        <Button
          variant={settings.textSize === "small" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setTextSize("small");
            toast("Mniejszy rozmiar tekstu");
          }}
        >
          <span className="flex items-center gap-1">
            <AArrowDown className="size-4" />
          </span>
        </Button>
        <Button
          variant={settings.textSize === "medium" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setTextSize("medium");
            toast("Standardowy rozmiar tekstu");
          }}
        >
          <span className="flex items-center gap-1">
            <ALargeSmall className="size-4" />
          </span>
        </Button>
        <Button
          variant={settings.textSize === "large" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setTextSize("large");
            toast("Większy rozmiar tekstu");
          }}
        >
          <span className="flex items-center gap-1">
            <AArrowUp className="size-4" />
          </span>
        </Button>
      </div>
    </section>
  );
}
