import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card, IconTile } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const deliverables = [
  {
    name: "Market Research Report",
    body: "Understand your market before committing to the build: market overview, target audience, market trends, demand signals, customer problems, opportunities, risks, and research evidence.",
    icon: icons.chart,
  },
  {
    name: "Competitor Intelligence",
    body: "Know who you're competing with: direct and indirect competitors, product and feature comparison, pricing, positioning, target customers, strengths, and gaps.",
    icon: icons.target,
  },
  {
    name: "Pricing Analysis",
    body: "Understand how similar products monetize: pricing models, subscription structures, free vs paid plans, competitor pricing, feature differences, and positioning opportunities.",
    icon: icons.coin,
  },
  {
    name: "SEO & Growth Opportunities",
    body: "Discover how people search for problems related to your product: search and content opportunities, relevant keywords, competitor SEO signals, acquisition opportunities, and landing-page ideas.",
    icon: icons.trend,
  },
  {
    name: "Validation Summary",
    body: "The research condensed into a clear decision-support document: what looks promising, what needs further validation, major risks, competitive pressure, opportunities, and open questions.",
    icon: icons.flag,
  },
  {
    name: "From Research to PRD",
    body: "Validated findings turned into a product plan: product definition, MVP scope, product requirements, technical direction, and launch planning.",
    icon: icons.file,
  },
];

export function Deliverables() {
  return (
    <Section id="deliverables">
      <SectionHeader
        eyebrow="WHAT YOU GET"
        title={
          <>
            AI Swarm Doesn’t Just Give You <Accent>a Chat Response.</Accent>
          </>
        }
        description="It produces structured research that you can actually use. AI Swarm doesn’t decide for you. It gives you better information to make the decision."
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
