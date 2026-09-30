export type LaunchStatus = "scheduled" | "open" | "closed";

/**
 * Access status is deliberately separate from stageAvailability. A visitor's
 * clock must never enable product functionality: the countdown only changes
 * the wording once `targetAt` passes. Flip `status` to "open" at deploy time.
 */
export const phaseOneLaunch = {
  status: "scheduled" as LaunchStatus,
  label: "Private beta",
  ctaLabel: "Start validating",
  scheduledCtaLabel: "Join the Private Beta",
  ctaHref: "#waitlist",
  countdownCtaHref: "#waitlist",
  /** Full ISO UTC timestamp. 28 Nov 2026, 10:00 IST. */
  targetAt: "2026-11-28T04:30:00.000Z" as string | null,
  displayTimezone: "Asia/Kolkata",
  /**
   * Human-readable form of `targetAt`, rendered on the server so the date is
   * visible without JavaScript. Kept as fixed strings: Intl output can differ
   * between Node and the browser and would cause a hydration mismatch.
   */
  displayDate: "28 Nov 2026",
  displayTime: "10:00 IST",
} as const;

/** Countdown only runs while scheduled with a date set. */
export const hasCountdown = phaseOneLaunch.status === "scheduled" && phaseOneLaunch.targetAt !== null;
