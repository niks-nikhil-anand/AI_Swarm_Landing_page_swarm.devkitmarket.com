import { prdPlan } from "../data/content";
import { Accent } from "../ui/Accent";
import { Card, IconTile } from "../ui/Card";
import { CheckItem } from "../ui/CheckItem";
import { fiveUpGrid, fiveUpItem } from "../ui/fiveUp";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

/** "From research to PRD": what the product plan can contain. */
export function PrdPlan() {
  return (
    <Section id="prd">
      <SectionHeader
        eyebrow="FROM RESEARCH TO PRD"
        title={
          <>
            Research Shouldn&rsquo;t End in <Accent>a PDF That Sits in a Folder.</Accent>
          </>
        }
        description="AI Swarm turns validated findings into a product plan. Your output can include:"
      />

      <div className={`mt-8 sm:mt-10 ${fiveUpGrid}`}>
        {prdPlan.map((part, i) => (
          <Card key={part.name} className={`gap-4 p-5 sm:p-6 ${fiveUpItem(i)}`}>
            <IconTile className="size-9 rounded-xl bg-brand/10 sm:size-10">
              <Icon d={part.icon} size={20} strokeWidth={1.5} className="text-brand-soft" />
            </IconTile>
            <h3 className="m-0 text-base font-medium text-fg">{part.name}</h3>
            <ul className="m-0 flex list-none flex-col gap-2 border-t border-line p-0 pt-4 text-[13px] leading-[1.5] text-fg-2 max-md:grid max-md:grid-cols-2 max-md:gap-x-4">
              {part.items.map((item) => (
                <li key={item}>
                  <CheckItem size={13} className="gap-2">
                    {item}
                  </CheckItem>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <p className="mt-5 font-code text-xs text-dim">
        PRD generation is part of the product roadmap: Phase 02 · Plan, coming next.
      </p>
    </Section>
  );
}
