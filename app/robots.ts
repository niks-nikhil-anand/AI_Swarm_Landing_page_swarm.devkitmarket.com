import type { MetadataRoute } from "next";
import { isPublicSiteUrl, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isPublicSiteUrl ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
