import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card, IconTile } from "../ui/Card";
import { CheckItem } from "../ui/CheckItem";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const method = [
  {
    name: "Start with questions",
    body: "The team turns your idea into a research plan you can review before work begins.",
    icon: icons.flag,
  },
  {
    name: "Use visible sources",
    body: "Market, competitor, pricing, search and community findings link back to their evidence.",
    icon: icons.link,
  },
  {
    name: "Separate specialist views",
    body: "Focused agents analyze different parts of the opportunity instead of producing one generic answer.",
    icon: icons.users,
  },
  {
    name: "Check the claims",
    body: "A verification pass flags weak evidence, conflicts, assumptions and claims that need human testing.",
    icon: icons.shieldCheck,
  },
];

export function Methodology() {
  return (
    <Section id="methodology">
      <SectionHeader
        eyebrow="HOW THE RESEARCH WORKS"
        title={
          <>
            SaaS market research, <Accent>with sources attached.</Accent>
          </>
        }
        description="AI can organize evidence and expose blind spots. It cannot replace customer conversations, experiments or actual sales. The report makes that boundary explicit."
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
            What validation cannot prove
          </h3>
        </div>
        <div className="grid grow grid-cols-1 gap-3 text-sm text-fg-2 sm:grid-cols-2">
          <CheckItem>Guaranteed demand or revenue</CheckItem>
          <CheckItem>Product-market fit before launch</CheckItem>
          <CheckItem>What customers will pay without testing</CheckItem>
          <CheckItem>Whether execution will beat the market</CheckItem>
        </div>
      </Card>
    </Section>
  );
}
