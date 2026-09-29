import { pricingTiers } from "../data/content";
import { Accent } from "../ui/Accent";
import { ButtonLink } from "../ui/ButtonLink";
import { Card } from "../ui/Card";
import { CheckItem } from "../ui/CheckItem";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

export function Pricing() {
  return (
    <Section id="pricing" className="flex flex-col items-center">
      <SectionHeader
        align="center"
        eyebrow="PRIVATE BETA PRICING"
        title={
          <>
            Validate before you <Accent>pay to build.</Accent>
          </>
        }
        description="Phase 1 is free during the private beta. No placeholder price, no subscription and no credit card required."
      />

      <div className="mt-8 grid w-full max-w-[680px] grid-cols-1 gap-5 sm:mt-10">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} variant={tier.featured ? "glow" : "default"} className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-fg">{tier.name}</h3>
              {tier.featured && (
                <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 font-code text-[10px] tracking-[0.08em] text-brand-soft">
                  COMPLETE PACK
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-[1.6] text-muted">{tier.desc}</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-[40px] tracking-[-0.02em] text-fg sm:text-5xl">{tier.price}</span>
              {tier.unit && <span className="text-sm text-muted">{tier.unit}</span>}
            </div>
            <span className="mt-2 font-code text-[11px] max-xl:text-xs text-dim">{tier.note}</span>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 border-t border-line p-0 pt-6 text-sm text-fg-2 sm:mt-7 sm:max-xl:grid sm:max-xl:grid-cols-2 sm:max-xl:gap-x-6">
              {tier.features.map((feature) => (
                <li key={feature}>
                  <CheckItem>{feature}</CheckItem>
                </li>
              ))}
            </ul>
            <ButtonLink href={tier.href} variant={tier.featured ? "primary" : "secondary"} className="mt-8 h-12 w-full lg:mt-auto">
              {tier.cta}
            </ButtonLink>
          </Card>
        ))}
      </div>
    </Section>
  );
}
