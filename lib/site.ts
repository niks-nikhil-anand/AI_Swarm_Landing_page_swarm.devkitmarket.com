const localSiteUrl = "http://localhost:3001";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// next.config.ts fills this from VERCEL_PROJECT_PRODUCTION_URL on Vercel production builds,
// so this only fires when neither is available (never ship a localhost canonical URL).
if (process.env.VERCEL_ENV === "production" && !configuredSiteUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be configured for a production deployment (VERCEL_PROJECT_PRODUCTION_URL was not available either).",
  );
}

function normalizeUrl(value: string) {
  return value.replace(/\/$/, "");
}

export const site = {
  name: "AI Swarm",
  productName: "AI Swarm",
  url: normalizeUrl(configuredSiteUrl ?? localSiteUrl),
  appUrl: normalizeUrl(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  description: "Validate your SaaS idea with sourced market research, competitor analysis and a build-ready PRD.",
  locale: "en_US",
} as const;

export const isPublicSiteUrl = !site.url.includes("localhost") && site.url.startsWith("https://");

export function registrationUrl(source: string) {
  const url = new URL("/register", `${site.appUrl}/`);
  url.searchParams.set("source", source);
  return url.toString();
}

export const contactHref = site.contactEmail ? `mailto:${site.contactEmail}` : null;
