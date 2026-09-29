import { landingFontVariables } from "./fonts";
import { AnnouncementBar } from "./sections/AnnouncementBar";
import { AppBuildersSkip } from "./sections/AppBuildersSkip";
import { Collaborators } from "./sections/Collaborators";
import { Deliverables } from "./sections/Deliverables";
import { Faq } from "./sections/Faq";
import { FinalCta } from "./sections/FinalCta";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { InControl } from "./sections/InControl";
import { Methodology } from "./sections/Methodology";
import { Navbar } from "./sections/Navbar";
import { Pricing } from "./sections/Pricing";
import { Stages } from "./sections/Stages";

export function LandingPage() {
  return (
    <div
      className={`landing ${landingFontVariables} min-h-dvh overflow-x-clip bg-ink bg-grid font-body text-fg antialiased`}
    >
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Deliverables />
        <Methodology />
        <HowItWorks />
        <AppBuildersSkip />
        <InControl />
        <Pricing />
        <Stages />
        <Collaborators />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
