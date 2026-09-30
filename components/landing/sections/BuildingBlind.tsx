import { Fragment } from "react";
import { buildingBlindRisks, saasJourney } from "../data/content";
import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

/** "Stop building blind" plus "Your SaaS journey starts here". */
export function BuildingBlind() {
  return (
    <Section id="building-blind">
      <SectionHeader
        eyebrow="STOP BUILDING BLIND"
        title={
          <>
            Stop Building <Accent>Blind.</Accent>
          </>
        }
        description="The expensive part of SaaS isn't always writing the code. It's spending months building something before discovering:"
      />

      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {buildingBlindRisks.map((risk) => (
          <li key={risk}>
            <Card className="h-full flex-row items-start gap-3 p-5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink/10 text-pink">
                <Icon d={icons.close} size={12} strokeWidth={2} />
              </span>
              <span className="text-[15px] leading-[1.5] text-fg">{risk}</span>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[15px] leading-[1.7] text-fg-2">AI Swarm is built to move those questions before the build.</p>

      <Card variant="accent" className="mt-8 gap-5 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:max-w-[420px]">
          <div className="font-code text-[11px] tracking-[0.12em] text-brand">YOUR SAAS JOURNEY STARTS HERE</div>
          <p className="m-0 mt-3 text-sm leading-[1.65] text-muted sm:text-[15px]">
            AI Swarm starts with the part founders often rush through:{" "}
            <span className="text-fg">understanding the opportunity.</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {saasJourney.map((step, i) => (
            <Fragment key={step}>
              <Chip
                tone={i === 0 ? "brand" : i === saasJourney.length - 1 ? "mint" : "neutral"}
                className="px-3 py-[7px] text-xs"
              >
                {step.toUpperCase()}
              </Chip>
              {i < saasJourney.length - 1 && <Icon d={icons.arrowRight} size={14} className="text-faint" />}
            </Fragment>
          ))}
        </div>
      </Card>
    </Section>
  );
}
