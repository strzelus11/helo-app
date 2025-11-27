import "@app/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { AppClientProviders } from "./providers.client";

export const metadata: Metadata = {
  title: "HELO™",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const root = document.documentElement;
                  const stored = localStorage.getItem('theme'); // 'light' | 'dark' | null

                  if (stored === 'dark') {
                    root.classList.add('dark');
                    root.classList.remove('light');
                  } else if (stored === 'light') {
                    root.classList.add('light');
                    root.classList.remove('dark');
                  } else {
                    // system: rely on prefers-color-scheme, no explicit class
                    root.classList.remove('light', 'dark');
                  }
                } catch {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-dvh bg-background text-foreground"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppClientProviders>{children}</AppClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
