import { stageAvailability, stages } from "../data/content";
import { hueTones } from "../data/tones";
import { Accent } from "../ui/Accent";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { AvailabilityBadge } from "../ui/StatusBadge";

export function Stages() {
  const roadmapOrder = ["validate", "plan", "launch", "build", "operate"];
  const roadmapStages = [...stages].sort(
    (a, b) => roadmapOrder.indexOf(a.key) - roadmapOrder.indexOf(b.key),
  );

  return (
    <Section id="roadmap">
      <SectionHeader
        eyebrow="PRODUCT ROADMAP"
        title={
          <>
            Validate and Plan launch first. <Accent>Build comes later.</Accent>
          </>
        }
        description="The private beta starts with the decisions that come before code. Later releases extend the same context into launch preparation, building and ongoing operation."
      />

      {/*
        Phones: a swipeable row where the next card peeks in (focusable so arrow keys scroll it).
        Tablets: 3 + 2 on a 6-column grid so no card sits alone. Desktop: 5 across.
      */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Roadmap stages"
        className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:mt-10 md:grid md:grid-cols-6 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-5 [&::-webkit-scrollbar]:hidden"
      >
        {roadmapStages.map((stage, i) => {
          const tone = hueTones[stage.hue];
          return (
            <Card
              key={stage.key}
              className={`w-[82%] shrink-0 snap-start p-5 sm:w-[60%] md:col-span-2 md:w-auto md:p-6 xl:col-span-1 xl:col-start-auto ${
                i === 3 ? "md:col-start-2" : ""
              }`}
            >
              {/* Wraps the badge under the label when the card is narrow, instead of cutting the label off. */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <span className={`font-code text-[11px] ${tone.text}`}>
                  {stage.n} · {stage.name.toUpperCase()}
                </span>
                <AvailabilityBadge value={stageAvailability[stage.key]} />
              </div>
              <p className="mt-4 text-sm leading-[1.6] text-muted">{stage.summary}</p>
              <ul className="m-0 mt-5 flex list-none flex-col gap-2 border-t border-line p-0 pt-4 text-[13px] leading-[1.5] text-fg-2">
                {stage.deliverables.slice(0, 3).map((deliverable) => (
                  <li key={deliverable}>· {deliverable}</li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
      <p aria-hidden="true" className="mt-3 font-code text-xs text-dim md:hidden">
        Swipe to see all {roadmapStages.length} stages →
      </p>
    </Section>
  );
}
