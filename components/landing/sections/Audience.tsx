import { audiences } from "../data/content";
import { Accent } from "../ui/Accent";
import { Card, IconTile } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

/** "Who is AI Swarm for?" */
export function Audience() {
  return (
    <Section id="audience">
      <SectionHeader
        eyebrow="WHO IT'S FOR"
        title={
          <>
            Who Is <Accent>AI Swarm For?</Accent>
          </>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {audiences.map((item) => (
          <Card key={item.name} direction="row" className="gap-4 p-5 sm:p-6">
            <IconTile className="size-9 rounded-xl bg-brand/10 sm:size-10">
              <Icon d={item.icon} size={20} strokeWidth={1.5} className="text-brand-soft" />
            </IconTile>
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 text-[15px] font-medium text-fg">{item.name}</h3>
              <p className="m-0 text-[13px] leading-[1.55] text-muted">{item.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
