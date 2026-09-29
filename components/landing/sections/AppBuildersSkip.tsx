import { comparePoints, compareColumns, compareRows, type Coverage } from "../data/content";
import { Accent } from "../ui/Accent";
import { Card } from "../ui/Card";
import { CheckItem } from "../ui/CheckItem";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const coverageLabel: Record<Coverage, string> = { 0: "None", 1: "Partial", 2: "Strong" };

function Dot({ value }: { value: Coverage }) {
  if (value === 2) return <span className="inline-block size-2.5 rounded-full bg-mint" />;
  if (value === 1)
    return <span className="inline-block size-2.5 rounded-full border border-mint bg-[linear-gradient(90deg,var(--color-mint)_50%,transparent_50%)]" />;
  return <span className="inline-block size-1.5 rounded-full bg-faint" />;
}

export function AppBuildersSkip() {
  return (
    <Section id="compare">
      <SectionHeader
        eyebrow="WHAT APP BUILDERS SKIP"
        title={
          <>
            App builders start at code. <Accent>We start at the idea.</Accent>
          </>
        }
        description="Turning a prompt into an app is the crowded middle. Phase 1 focuses on the work before code: whether the opportunity is real and what is actually worth building."
      />

      <Card className="mt-12 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="bg-panel px-4 py-4 font-code text-[10px] font-normal tracking-[0.08em] text-dim sm:sticky sm:left-0 sm:px-6 sm:text-[11px]">
                  <span className="sm:hidden">TOOL</span>
                  <span className="max-sm:sr-only">STAGE COVERAGE</span>
                </th>
                {compareColumns.map((c) => (
                  <th
                    key={c.label}
                    scope="col"
                    className={`px-1.5 py-4 text-center font-code text-[10px] font-normal tracking-[0.06em] sm:px-3 sm:text-[11px] ${
                      c.edge ? "bg-brand/6 text-brand-soft" : "text-dim"
                    }`}
                  >
                    <span aria-hidden="true" className="sm:hidden">{c.short}</span>
                    <span className="max-sm:sr-only">{c.label.toUpperCase()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.name} className={`border-b border-line last:border-b-0 ${row.ours ? "bg-brand/8" : ""}`}>
                  <th
                    scope="row"
                    className={`px-4 py-3.5 text-[13px] max-sm:leading-snug sm:sticky sm:left-0 sm:px-6 sm:py-4 sm:text-sm sm:whitespace-nowrap ${
                      row.ours ? "bg-panel-2 font-medium text-brand-soft" : "bg-panel font-normal text-fg-2"
                    }`}
                  >
                    {row.name}
                  </th>
                  {row.cells.map((v, i) => (
                    <td
                      key={compareColumns[i].label}
                      className={`px-1.5 py-3.5 text-center sm:px-3 sm:py-4 ${compareColumns[i].edge && !row.ours ? "bg-brand/6" : ""}`}
                    >
                      <span className="sr-only">{coverageLabel[v]}</span>
                      <span aria-hidden="true">
                        <Dot value={v} />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-4 py-3.5 font-code text-[11px] max-xl:text-xs text-dim sm:px-6">
          {([2, 1, 0] as Coverage[]).map((v) => (
            <span key={v} className="flex items-center gap-2">
              <Dot value={v} />
              {coverageLabel[v]}
            </span>
          ))}
          <span className="sm:ml-auto">This comparison covers the work that happens before code.</span>
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-3 text-[15px] text-fg sm:mt-8 md:grid md:grid-cols-3 md:gap-6 lg:flex lg:flex-row lg:gap-10">
        {comparePoints.map((p) => (
          <CheckItem key={p}>{p}</CheckItem>
        ))}
      </div>
    </Section>
  );
}
