import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// Tell the plugin where the i18n request config lives (we'll create this file next)
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
