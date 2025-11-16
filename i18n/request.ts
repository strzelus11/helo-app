import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

type SupportedLocale = "en" | "pl";

async function resolveLocale(): Promise<SupportedLocale> {
	const supported: SupportedLocale[] = ["en", "pl"];

	// 1) Try NEXT_LOCALE cookie (set by our language switcher)
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
	if (cookieLocale && supported.includes(cookieLocale as SupportedLocale)) {
		return cookieLocale as SupportedLocale;
	}

	// 2) Try Accept-Language header (browser preference)
	const hdrs = await headers();
	const acceptLanguage = hdrs.get("accept-language");
	if (acceptLanguage) {
		const primaryTag = acceptLanguage.split(",")[0]?.trim().slice(0, 2); // e.g. "en", "pl"
		if (primaryTag && supported.includes(primaryTag as SupportedLocale)) {
			return primaryTag as SupportedLocale;
		}
	}

	// 3) Fallback
	return "en";
}

export default getRequestConfig(async () => {
	const locale = await resolveLocale();

	return {
		locale,
		messages: (await import(`@app/locales/${locale}.json`)).default,
	};
});
