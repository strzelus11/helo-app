"use client";

import { Button } from "@app/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useSettings } from "../context/SettingsContext";

export function LanguageSwitcher() {
	const router = useRouter();
	const locale = useLocale();
	const { settings, setLanguage } = useSettings();

	const current = settings.language ?? (locale === "pl" ? "pl" : "en");

	const changeLocale = (nextLocale: "en" | "pl") => {
		if (nextLocale === current) return;
		setLanguage(nextLocale);
		document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
		router.refresh();
	};

	return (
		<div className="inline-flex rounded-md border border-border p-0.5 gap-1 bg-background">
			<Button
				type="button"
				variant={current === "en" ? "default" : "ghost"}
				size="sm"
				className="px-3"
				onClick={() => changeLocale("en")}
			>
				EN
			</Button>
			<Button
				type="button"
				variant={current === "pl" ? "default" : "ghost"}
				size="sm"
				className="px-3"
				onClick={() => changeLocale("pl")}
			>
				PL
			</Button>
		</div>
	);
}
