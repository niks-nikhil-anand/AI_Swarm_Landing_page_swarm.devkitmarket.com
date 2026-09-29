import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

/** Standard page band: top hairline, 1440px content column. Padding steps up phone → tablet → desktop (96px top at lg+). */
export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line/60">
      <div className={`mx-auto max-w-[1440px] px-5 pt-14 pb-16 sm:px-8 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 ${className}`}>
        {children}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1440px] px-5 sm:px-8 ${className}`}>{children}</div>;
}
