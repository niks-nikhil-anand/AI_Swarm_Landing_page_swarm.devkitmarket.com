import { researchAgents } from "../data/content";
import { Accent } from "../ui/Accent";
import { Card, IconTile } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";


export function InControl() {
  return (
    <Section id="control">
      <SectionHeader
        eyebrow="THE AGENTS"
        title={
          <>
            Meet Your <Accent>AI Research Team.</Accent>
          </>
        }
        description="AI Swarm isn’t just another chatbot. It brings multiple specialized AI agents together to research your SaaS idea and turn scattered information into one actionable decision."
      />

      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:gap-5 md:grid-cols-2">
        {researchAgents.map((item) => (
          <Card key={item.name} direction="row" className="gap-4 p-5 sm:p-6">
            <IconTile className="size-9 rounded-xl bg-brand/10 sm:size-10">
              <Icon d={item.icon} size={20} strokeWidth={1.5} className="text-brand" />
            </IconTile>
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-medium text-fg">{item.name}</span>
              <span className="text-[13px] leading-[1.55] text-muted">{item.body}</span>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
