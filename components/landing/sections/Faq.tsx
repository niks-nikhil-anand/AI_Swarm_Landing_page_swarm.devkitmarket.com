"use client";

import { useState } from "react";
import { faqs, routes } from "../data/content";
import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { ArrowLink } from "../ui/ButtonLink";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-[1fr_1.4fr]">
      {/* Tablet portrait: heading and intro side by side above the questions. */}
      <div className="flex flex-col md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:items-end md:max-lg:gap-x-10">
        <SectionHeader
          eyebrow="FAQ"
          size="lg"
          title={
            <>
              SaaS validation questions, <Accent>answered.</Accent>
            </>
          }
        />
        <p className="mt-4 max-w-[420px] text-[15px] leading-[1.7] text-muted md:max-lg:mt-0">
          {routes.contact
            ? "Something missing? Ask us directly and we’ll add the answer here."
            : "The private beta is focused on Validate + Plan. More answers will be added as the roadmap ships."}
        </p>
        {routes.contact && (
          <ArrowLink href={routes.contact} className="mt-6 self-start text-[15px]">
            Ask a Question
          </ArrowLink>
        )}
      </div>

      <div className="flex flex-col border-t border-line">
        {faqs.map((item, i) => {
          const open = openIndex === i;
          const panelId = `faq-panel-${i}`;
          return (
            <div key={item.q} className="border-b border-line">
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 border-0 bg-transparent p-0 py-3 text-left text-[15px] font-medium text-fg sm:text-base"
                >
                  {item.q}
                  <Icon
                    d={open ? icons.minus : icons.plus}
                    size={18}
                    strokeWidth={1.8}
                    className={open ? "text-brand-soft" : "text-dim"}
                  />
                </button>
              </h3>
              <p
                id={panelId}
                hidden={!open}
                className="m-0 pr-2 pb-[22px] text-[15px] leading-[1.7] text-muted sm:pr-10"
              >
                {item.a}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
