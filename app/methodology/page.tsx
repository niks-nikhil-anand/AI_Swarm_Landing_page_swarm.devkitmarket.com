import type { Metadata } from "next";
import { landingFontVariables } from "@/components/landing/fonts";
import { Navbar } from "@/components/landing/sections/Navbar";

export const metadata: Metadata = {
  title: "SaaS Idea Validation Methodology",
  description: "How AI Swarm researches a SaaS market, compares competitors, checks claims and turns the evidence into a PRD.",
  alternates: { canonical: "/methodology" },
};

const steps = [
  {
    title: "1. Turn the idea into research questions",
    body: "The process starts by defining the customer, problem, category, alternatives and riskiest assumptions. You review the proposed scope before research begins, so the work addresses the decision you actually need to make.",
  },
  {
    title: "2. Gather evidence from visible sources",
    body: "Specialist agents inspect relevant public sources such as company websites, pricing pages, product documentation, search results and public communities. Findings retain their source links instead of being presented as unsupported facts.",
  },
  {
    title: "3. Compare the market and competitors",
    body: "The research separates direct competitors, indirect alternatives and existing user behavior. Products, positioning, features and pricing are organized into a comparable matrix so gaps can be evaluated in context.",
  },
  {
    title: "4. Check claims and expose uncertainty",
    body: "A verification pass looks for conflicting evidence, stale information and claims that still need customer interviews, prototypes or sales tests. AI validation reduces uncertainty; it does not promise demand, revenue or product-market fit.",
  },
  {
    title: "5. Convert the findings into a decision and PRD",
    body: "The final pack connects evidence to a go, pivot or no-go recommendation, then translates the supported opportunity into personas, journeys, requirements and a deliberately constrained MVP scope.",
  },
];

export default function MethodologyPage() {
  return (
    <div className={`landing ${landingFontVariables} min-h-dvh bg-ink bg-grid font-body text-fg antialiased`}>
      <Navbar />

      <main className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:py-24">
        <p className="font-code text-xs tracking-[0.12em] text-brand-soft">RESEARCH METHODOLOGY</p>
        <h1 className="mt-5 max-w-[800px] font-display text-[42px] leading-[1.1] tracking-[-0.025em] sm:text-[60px]">
          How AI Swarm validates a SaaS idea.
        </h1>
        <p className="mt-6 max-w-[720px] text-lg leading-[1.7] text-muted">
          A source-first process for understanding the market, comparing competitors and deciding what—if anything—is worth building.
        </p>

        <div className="mt-14 grid gap-5">
          {steps.map((step) => (
            <section key={step.title} className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
              <h2 className="text-xl font-medium text-fg">{step.title}</h2>
              <p className="mt-3 text-base leading-[1.75] text-muted">{step.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-brand/30 bg-brand/8 p-6 sm:p-8">
          <h2 className="font-display text-2xl">What the result can—and cannot—tell you</h2>
          <p className="mt-4 text-base leading-[1.75] text-muted">
            The output can show market patterns, competitive gaps, evidence quality and the assumptions that need testing next. It cannot guarantee demand, product-market fit, revenue or execution quality. Those require conversations and experiments with real customers.
          </p>
        </section>
      </main>
    </div>
  );
}
