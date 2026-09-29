import { site } from "@/lib/site";

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/apple-icon`,
      parentOrganization: {
        "@type": "Organization",
        name: "DevKit Market",
      },
      ...(site.contactEmail
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              email: site.contactEmail,
              contactType: "customer support",
            },
          }
        : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      publisher: { "@id": `${site.url}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${site.url}/#software`,
      name: site.productName,
      url: site.url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: site.description,
      featureList: [
        "SaaS market research",
        "Competitor analysis",
        "Pricing recommendations",
        "SEO opportunity research",
        "PRD and MVP planning",
        "Go, pivot, or no-go recommendation",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free during private beta",
        availability: "https://schema.org/PreOrder",
      },
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
