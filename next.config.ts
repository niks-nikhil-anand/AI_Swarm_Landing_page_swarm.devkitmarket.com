import type { NextConfig } from "next";

/**
 * Public origin of the site (canonical URLs, sitemap, OG images, JSON-LD).
 * An explicit NEXT_PUBLIC_SITE_URL always wins. On Vercel production builds without it,
 * fall back to the project's production domain, which Vercel exposes to every build as
 * VERCEL_PROJECT_PRODUCTION_URL (hostname only, no protocol). Set through `env` so the
 * same value is inlined on the server and in the browser bundle.
 */
const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production" && productionDomain ? `https://${productionDomain}` : undefined);

const nextConfig: NextConfig = {
  ...(siteUrl ? { env: { NEXT_PUBLIC_SITE_URL: siteUrl } } : {}),
};

export default nextConfig;
