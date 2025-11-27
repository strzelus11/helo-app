"use client";

import { Button } from "@app/components/ui/button";
import { useSettings } from "@features/settings/context/SettingsContext";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";

export function LanguageSettingsSection() {
  const router = useRouter();
  const locale = useLocale();
  const { settings, setLanguage } = useSettings();

  const current: "pl" | "en" =
    (settings.language as "pl" | "en") ?? (locale === "pl" ? "pl" : "en");

  const changeLocale = (nextLocale: "en" | "pl") => {
    if (nextLocale === current) return;

    setLanguage(nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;

    if (nextLocale === "pl") {
      toast("Język ustawiony na polski");
    } else {
      toast("Language set to English");
    }

    router.refresh();
  };

  return (
    <section className="space-y-2">
      <p className="font-medium flex items-center gap-2">Język</p>
      <div className="flex gap-2">
        <Button
          variant={current === "pl" ? "default" : "outline"}
          size="sm"
          onClick={() => changeLocale("pl")}
        >
          <span className="flex items-center gap-1">
            <Languages className="h-3.5 w-3.5" />
            PL
          </span>
        </Button>
        <Button
          variant={current === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => changeLocale("en")}
        >
          <span className="flex items-center gap-1">
            <Languages className="h-3.5 w-3.5" />
            EN
          </span>
        </Button>
      </div>
    </section>
  );
}
