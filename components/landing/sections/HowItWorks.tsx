import { Fragment } from "react";
import { howFlow, stageAvailability, steps } from "../data/content";
import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { AvailabilityBadge } from "../ui/StatusBadge";

function flowTone(i: number) {
  if (i === 1) return "brand" as const;
  if (i === howFlow.length - 1) return "mint" as const;
  return "neutral" as const;
}

export function HowItWorks() {
  return (
    <Section id="how">
      <SectionHeader
        eyebrow="HOW IT WORKS"
        title={
          <>
            From idea to <Accent>evidence and a plan.</Accent>
          </>
        }
        description="Describe the idea once. Review the research plan, watch the specialist analysis, then download the evidence and build-ready specification."
      />

      <div className="mt-8 flex flex-wrap items-center gap-2 sm:mt-10 sm:gap-2.5">
        {howFlow.map((label, i) => (
          <Fragment key={label}>
            <Chip tone={flowTone(i)} className="px-3 py-[7px] text-xs">
              {label}
            </Chip>
            {i < howFlow.length - 1 && <Icon d={icons.arrowRight} size={14} className="text-faint" />}
          </Fragment>
        ))}
      </div>

      {/* 2 × 2 on tablets (4 columns only have room from xl). */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {steps.map((s) => (
          <Card key={s.n} className="p-5 sm:p-6 xl:h-[340px]">
            <div className="flex items-center justify-between">
              <span className="font-code text-xs text-brand">{s.n}</span>
              {s.stage && <AvailabilityBadge value={stageAvailability[s.stage]} />}
            </div>
            <span className="mt-3 text-[17px] font-medium text-fg sm:mt-3.5 sm:text-lg">{s.title}</span>
            <span className="mt-2 text-[13px] leading-[1.55] text-muted">{s.body}</span>
            {/* Phones: the output as one line instead of a 130px code panel. */}
            <span className="mt-3 font-code text-xs leading-[1.6] text-fg-2 sm:hidden">
              {s.summary}
            </span>
            <div className="mt-6 hidden h-[130px] rounded-xl border border-edge bg-code p-4 font-code text-xs leading-[1.8] whitespace-pre-line text-fg-2 sm:block xl:mt-auto">
              {s.code}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
