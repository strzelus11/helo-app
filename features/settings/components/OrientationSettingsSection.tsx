"use client";

import { Switch } from "@app/components/ui/switch";
import { useSettings } from "@features/settings/context/SettingsContext";
import { toast } from "sonner";

export function OrientationSettingsSection() {
  const { settings, setOrientationEnabled } = useSettings();

  return (
    <section className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">Obrót mapy</p>
        <p className="text-xs text-muted-foreground">
          Jeśli wyłączone, mapa zawsze z północą u góry.
        </p>
      </div>
      <Switch
        checked={settings.orientationEnabled}
        onCheckedChange={(checked) => {
          setOrientationEnabled(checked);
          toast(
            checked
              ? "Obrót mapy według orientacji urządzenia"
              : "Mapa ustawiona z północą u góry",
          );
        }}
      />
    </section>
  );
}
