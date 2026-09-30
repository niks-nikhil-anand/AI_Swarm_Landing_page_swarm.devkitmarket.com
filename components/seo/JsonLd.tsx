import { collaborators, team } from "@/components/landing/data/content";
import { site } from "@/lib/site";

const personId = (name: string) => `${site.url}/#${name.toLowerCase().replace(/\s+/g, "-")}`;

/** The people shown in the homepage "The team" section; mirrors only what the page states. */
const people = collaborators.map((person) => ({
  "@type": "Person",
  "@id": personId(person.name),
  name: person.name,
  jobTitle: person.role,
  image: `${site.url}${person.photo}`,
  worksFor: { "@id": `${site.url}/#employer` },
  sameAs: person.socials.map((social) => social.href),
}));

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
        name: "DevKitMarket",
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
      creator: collaborators.map((person) => ({ "@id": personId(person.name) })),
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#employer`,
      name: team.company,
      address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    },
    ...people,
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
