import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card, IconTile } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const deliverables = [
  {
    name: "Market report",
    body: "Market shape, customer segments, demand signals and the assumptions that still need testing.",
    icon: icons.chart,
  },
  {
    name: "Competitor matrix",
    body: "Products, positioning, features, prices, strengths and gaps in a spreadsheet you can filter.",
    icon: icons.target,
  },
  {
    name: "Pricing analysis",
    body: "Comparable plans, packaging patterns and a reasoned starting hypothesis for your offer.",
    icon: icons.coin,
  },
  {
    name: "SEO opportunities",
    body: "Search themes, intent and early content opportunities grounded in the market research.",
    icon: icons.trend,
  },
  {
    name: "Decision summary",
    body: "A direct go, pivot or no-go recommendation with evidence, risks and next experiments.",
    icon: icons.flag,
  },
  {
    name: "PRD and MVP scope",
    body: "Personas, journeys, requirements, priorities and a deliberately constrained first release.",
    icon: icons.file,
  },
];

export function Deliverables() {
  return (
    <Section id="deliverables">
      <SectionHeader
        eyebrow="WHAT YOU RECEIVE"
        title={
          <>
            SaaS idea validation. <Accent>From competitors to PRD.</Accent>
          </>
        }
        description="One idea becomes a source-backed research pack and a build-ready product plan. Use the files with AI Swarm, your own team, or any development tool."
      />

      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {deliverables.map((item) => (
          <Card key={item.name} className="gap-4 p-5 max-sm:flex-row sm:p-7">
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
    </Section>
  );
}
