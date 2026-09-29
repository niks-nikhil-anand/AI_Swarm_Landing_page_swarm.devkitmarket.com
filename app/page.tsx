import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "AI SaaS Idea Validation: Market Research to PRD",
  description: "Validate your SaaS idea with sourced market research, competitor analysis, pricing insights and a build-ready PRD. Join the private-beta waitlist.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Validate Your SaaS Idea with an AI Research Team",
    description: "Sourced market research, competitor analysis and a build-ready PRD. Join the private-beta waitlist.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Validate Your SaaS Idea with an AI Research Team",
    description: "Sourced market research, competitor analysis and a build-ready PRD.",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd />
      <LandingPage />
    </>
  );
}
