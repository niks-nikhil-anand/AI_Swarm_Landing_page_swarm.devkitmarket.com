import { footerColumns } from "../data/content";
import { LogoMark } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col px-5 pt-12 pb-8 sm:px-8 sm:pt-16 lg:min-h-[340px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 md:grid-cols-4 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-3.5 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[15px] font-medium">AI Swarm</span>
            </div>
            <p className="m-0 max-w-[300px] text-[13px] leading-[1.65] text-muted">
              Validate your SaaS idea, understand the market and leave with a build-ready product plan.
            </p>
            <span className="font-code text-xs text-dim">A DevKit Market product</span>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="flex flex-col gap-2.5 max-xl:gap-1">
              <span className="font-code text-xs tracking-[0.08em] text-dim">{column.heading}</span>
              {column.links.map((link) => (
                <a key={link.href} href={link.href} className="text-[13px] text-muted hover:text-fg max-xl:py-2">
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-line pt-5 font-code text-[11px] max-xl:text-xs text-dim sm:mt-12 sm:flex-row lg:mt-auto">
          <span>© 2026 AI Swarm · a DevKit Market product</span>
          <span>Built by a developer · for developers</span>
        </div>
      </div>
    </footer>
  );
}
