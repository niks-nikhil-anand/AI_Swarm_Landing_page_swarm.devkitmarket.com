import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card, IconTile } from "../ui/Card";
import { CheckItem } from "../ui/CheckItem";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const method = [
  {
    name: "Evidence",
    body: "Information supported by a source.",
    icon: icons.flag,
  },
  {
    name: "Inference",
    body: "A conclusion derived from available evidence.",
    icon: icons.link,
  },
  {
    name: "Unknown",
    body: "Something that requires additional validation.",
    icon: icons.users,
  },
  {
    name: "Inspect the research",
    body: "Important findings connect to the underlying research. This makes AI Swarm a research system, not just a text generator.",
    icon: icons.shieldCheck,
  },
];

export function Methodology() {
  return (
    <Section id="methodology">
      <SectionHeader
        eyebrow="RESEARCH WITH EVIDENCE"
        title={
          <>
            Research First. Evidence Second. <Accent>Conclusions Third.</Accent>
          </>
        }
        description="AI-generated answers can sound convincing even when they’re wrong. Instead of “The market is growing rapidly,” AI Swarm helps you understand what evidence supports it."
      />

      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-2">
        {method.map((item) => (
          <Card key={item.name} direction="row" className="gap-4 p-5 sm:p-7">
            <IconTile className="size-9 rounded-xl bg-brand/10 sm:size-10">
              <Icon d={item.icon} size={20} strokeWidth={1.5} className="text-brand-soft" />
            </IconTile>
            <div>
              <h3 className="text-base font-medium text-fg">{item.name}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-muted">{item.body}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card variant="accent" className="mt-3 gap-5 p-5 sm:mt-5 sm:gap-6 sm:p-8 lg:flex-row lg:items-start">
        <div className="lg:w-[34%]">
          <div className="font-code text-[11px] tracking-[0.12em] text-brand">LIMITS</div>
          <h3 className="mt-3 font-display text-[22px] leading-tight font-normal text-fg sm:text-2xl">
            Research can’t guarantee success
          </h3>
        </div>
        <div className="grid grow grid-cols-1 gap-3 text-sm text-fg-2 sm:grid-cols-2">
          <CheckItem>Product-market fit</CheckItem>
          <CheckItem>Business success</CheckItem>
          <CheckItem>It reduces uncertainty</CheckItem>
          <CheckItem>The decision stays yours</CheckItem>
        </div>
      </Card>
    </Section>
  );
}
