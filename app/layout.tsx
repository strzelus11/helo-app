import "@app/globals.css";
import { cn } from "@app/lib/utils";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { AppClientProviders } from "./providers.client";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "HELO™",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
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
