import { landingFontVariables } from "./fonts";
import { AnnouncementBar } from "./sections/AnnouncementBar";
import { AppBuildersSkip } from "./sections/AppBuildersSkip";
import { Audience } from "./sections/Audience";
import { BuildingBlind } from "./sections/BuildingBlind";
import { Collaborators } from "./sections/Collaborators";
import { Deliverables } from "./sections/Deliverables";
import { Faq } from "./sections/Faq";
import { FinalCta } from "./sections/FinalCta";
import { Founders } from "./sections/Founders";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { InControl } from "./sections/InControl";
import { Methodology } from "./sections/Methodology";
import { Navbar } from "./sections/Navbar";
import { PrdPlan } from "./sections/PrdPlan";
import { Pricing } from "./sections/Pricing";
import { ProblemQuestions } from "./sections/ProblemQuestions";
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
        <ProblemQuestions />
        <Deliverables />
        <PrdPlan />
        <Methodology />
        <HowItWorks />
        <AppBuildersSkip />
        <InControl />
        <Founders />
        <BuildingBlind />
        <Audience />
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
