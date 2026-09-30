import { founderMoments } from "../data/content";
import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card } from "../ui/Card";
import { fiveUpGrid, fiveUpItem } from "../ui/fiveUp";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

/** "Built for SaaS founders": where you are, and where AI Swarm starts. */
export function Founders() {
  return (
    <Section id="founders">
      <SectionHeader
        eyebrow="BUILT FOR SAAS FOUNDERS"
        title={
          <>
            Built for <Accent>SaaS Founders.</Accent>
          </>
        }
        description="Whether you're building your first startup or your tenth product, AI Swarm helps answer the questions that come before the code."
      />

      <div className={`mt-8 sm:mt-10 ${fiveUpGrid}`}>
        {founderMoments.map((moment, i) => (
          <Card key={moment.quote} className={`gap-4 p-5 sm:p-6 ${fiveUpItem(i)}`}>
            <p className="m-0 font-display text-xl leading-snug text-fg italic">&ldquo;{moment.quote}&rdquo;</p>
            <p className="m-0 mt-auto flex items-start gap-2 border-t border-line pt-4 text-sm leading-[1.55] text-muted">
              <Icon d={icons.arrowRight} size={14} className="mt-[3px] shrink-0 text-brand-soft" />
              {moment.answer}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
