import { problemQuestions } from "../data/content";
import { Accent } from "../ui/Accent";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

/** "Your idea deserves more than a guess": the questions to answer before building. */
export function ProblemQuestions() {
  return (
    <Section id="problem">
      <SectionHeader
        eyebrow="BEFORE YOU BUILD"
        title={
          <>
            Your Idea Deserves <Accent>More Than a Guess.</Accent>
          </>
        }
        description="You have an idea. But before spending weeks building it, you need answers."
      />

      <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:mt-10 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {problemQuestions.map((question, i) => (
          <li key={question}>
            <Card className="h-full flex-row items-start gap-3.5 p-5">
              <span className="mt-0.5 shrink-0 font-code text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] leading-[1.5] text-fg">{question}</span>
            </Card>
          </li>
        ))}
      </ol>

      <Card variant="accent" className="mt-3 gap-2 p-5 sm:mt-5 sm:p-8">
        <p className="m-0 font-display text-[22px] leading-tight text-fg sm:text-2xl">
          AI Swarm researches these questions for you.
        </p>
        <p className="m-0 max-w-[760px] text-sm leading-[1.65] text-muted sm:text-[15px]">
          Instead of asking one AI to do everything, AI Swarm uses a coordinated team of specialized agents — each
          focused on a different part of the research process.
        </p>
      </Card>
    </Section>
  );
}
