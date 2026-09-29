import { Fragment } from "react";
import { Accent } from "../ui/Accent";
import { Eyebrow } from "../ui/SectionHeader";
import { WaitlistForm } from "../ui/WaitlistForm";

const corner = "absolute hidden size-3.5 border-brand/50 sm:block";
const flow = ["idea", "research", "evidence", "decision", "PRD", "MVP scope"];
/** Phones get the three steps that tell the story; the full chain wraps onto 3 lines there. */
const shortFlow = ["idea", "evidence", "PRD"];

export function FinalCta() {
  return (
    <section id="waitlist" className="scroll-mt-24 border-t border-line/60">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-12 lg:py-16">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[20px] border border-line bg-panel bg-grid-brand px-5 py-12 sm:rounded-[28px] sm:px-6 sm:py-16 shadow-[0_32px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.5)] lg:h-[492px] lg:py-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[120px] left-1/2 h-[400px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(124,111,247,0.22),transparent_70%)]"
          />
          <span aria-hidden="true" className={`${corner} top-5 left-5 border-t border-l`} />
          <span aria-hidden="true" className={`${corner} top-5 right-5 border-t border-r`} />
          <span aria-hidden="true" className={`${corner} bottom-5 left-5 border-b border-l`} />
          <span aria-hidden="true" className={`${corner} right-5 bottom-5 border-r border-b`} />

          <div className="relative">
            <Eyebrow>VALIDATE + PLAN</Eyebrow>
          </div>
          <h2 className="relative mt-4 text-center font-display text-[32px] leading-[1.08] font-normal tracking-[-0.03em] min-[375px]:text-[38px] md:text-[48px] lg:text-[58px]">
            Make the decision <Accent strong>before the build.</Accent>
          </h2>
          <p className="relative mt-4 max-w-[520px] text-center text-[15px] leading-[1.7] text-muted sm:mt-5 sm:text-base">
            Get the market evidence, competitor analysis and product plan you need to move forward—or change direction—with confidence.
          </p>
          <div className="relative mt-7 flex w-full justify-center sm:mt-9">
            <WaitlistForm source="final_cta" />
          </div>
          <div className="relative mt-8 flex items-center justify-center gap-2.5 font-code text-xs text-dim sm:hidden">
            {shortFlow.map((step, i) => (
              <Fragment key={step}>
                <span className={i === shortFlow.length - 1 ? "text-mint" : ""}>{step}</span>
                {i < shortFlow.length - 1 && <span className="text-faint">→</span>}
              </Fragment>
            ))}
          </div>
          <div className="relative mt-11 hidden flex-wrap items-center justify-center gap-2.5 font-code text-[11px] max-xl:text-xs text-dim sm:flex">
            {flow.map((step, i) => (
              <Fragment key={step}>
                <span className={i === flow.length - 1 ? "text-mint" : ""}>{step}</span>
                {i < flow.length - 1 && <span className="text-faint">→</span>}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
