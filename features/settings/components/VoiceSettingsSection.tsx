"use client";

import { Switch } from "@app/components/ui/switch";
import { useSettings } from "@features/settings/context/SettingsContext";
import { toast } from "sonner";

export function VoiceSettingsSection() {
  const { settings, setVoiceEnabled } = useSettings();

  return (
    <section className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">Instrukcje głosowe</p>
        <p className="text-xs text-muted-foreground">
          Czytaj na głos kroki nawigacji.
        </p>
      </div>
      <Switch
        checked={settings.voiceEnabled}
        onCheckedChange={(checked) => {
          setVoiceEnabled(checked);
          toast(
            checked
              ? "Instrukcje głosowe włączone"
              : "Instrukcje głosowe wyłączone",
          );
        }}
      />
    </section>
  );
}
