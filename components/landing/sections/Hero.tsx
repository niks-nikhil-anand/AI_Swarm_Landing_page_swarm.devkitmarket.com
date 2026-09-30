import { hasCountdown } from "../data/launch";
import { Accent } from "../ui/Accent";
import { ButtonLink } from "../ui/ButtonLink";
import { CheckItem } from "../ui/CheckItem";
import { CountdownTiles } from "../ui/LaunchCountdown";
import { HeroDemo } from "./HeroDemo";
import { HeroIdeaForm } from "../ui/HeroIdeaForm";

const assurances = ["Private Beta · Launching November 28, 2026", "Built by Nikhil Anand · DevKitMarket"];

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center_top,rgba(124,111,247,0.18),transparent_70%)] lg:h-[420px] lg:w-[900px]"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-5 pt-10 pb-14 sm:px-8 md:pt-16 md:pb-20 lg:pt-24 lg:pb-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-[5px] font-code text-xs text-brand-soft lg:px-3.5 lg:py-1.5">
          <span className="size-1.5 animate-blink rounded-full bg-mint" />
          <span className="lg:hidden">AI Swarm · Private beta</span>
          <span className="hidden lg:inline">AI Swarm · SaaS idea validation</span>
        </div>

        <h1 className="mt-5 text-center font-display text-[30px] leading-[1.12] font-normal tracking-[-0.02em] text-fg min-[375px]:text-[40px] md:text-[54px] lg:mt-6 lg:text-[68px] lg:leading-[1.1]">
          Validate Your SaaS Idea
          {/* Forced break only where both halves fit on one line; small phones wrap naturally. */}
          <br className="hidden sm:block" />{" "}
          <Accent>Before You Build It.</Accent>
        </h1>

        <p className="mt-[18px] max-w-[620px] text-center text-[15px] leading-[1.65] text-muted md:text-[17px] lg:mt-6">
          Turn an idea into a research-backed product plan with an AI team that researches your market, competitors, customers, pricing, demand, and opportunities.
        </p>

        <div className="mt-7 flex w-full flex-col items-center gap-3 lg:mt-10">
          <HeroIdeaForm />
          {/* A quiet text link on phones so it doesn't compete with the waitlist button. */}
          <ButtonLink
            href="#how"
            variant="secondary"
            className="h-11 px-6 max-sm:border-transparent max-sm:px-3 max-sm:text-[14px]"
          >
            See How It Works
          </ButtonLink>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 font-code text-xs text-dim sm:gap-x-5 lg:mt-5">
          {assurances.map((item) => (
            <CheckItem key={item} size={13} className="gap-1.5">
              {item}
            </CheckItem>
          ))}
        </div>

        {hasCountdown && <CountdownTiles />}

        <HeroDemo />
      </div>
    </section>
  );
}
