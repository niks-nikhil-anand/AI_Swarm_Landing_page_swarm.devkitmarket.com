import { hasCountdown, phaseOneLaunch } from "../data/launch";
import { CountdownInline } from "../ui/LaunchCountdown";

export function AnnouncementBar() {
  return (
    <div className="flex h-9 items-center justify-center gap-2 border-b border-line bg-brand/6 font-code text-xs text-muted sm:h-10 sm:gap-3">
      <span className="hidden rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] tracking-[0.08em] text-brand-soft sm:inline">
        BETA
      </span>
      {hasCountdown ? (
        <CountdownInline />
      ) : (
        <>
          <span className="md:hidden">Phase 1 beta is open</span>
          <span className="hidden md:inline">
            Phase 1 private beta is open · Validate and plan your SaaS with an AI team
          </span>
          <a href={phaseOneLaunch.ctaHref} className="text-brand-soft hover:text-fg max-xl:inline-flex max-xl:min-h-9 max-xl:items-center max-xl:px-1">
            <span className="md:hidden">Validate →</span>
            <span className="hidden md:inline">{phaseOneLaunch.ctaLabel} →</span>
          </a>
        </>
      )}
    </div>
  );
}
