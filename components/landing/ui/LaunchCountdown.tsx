"use client";

import { useSyncExternalStore } from "react";
import { phaseOneLaunch } from "../data/launch";

const target = phaseOneLaunch.targetAt ? Date.parse(phaseOneLaunch.targetAt) : null;

/* ---------- Shared 1s clock: one interval for every countdown on the page ---------- */

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

const nowSeconds = () => Math.floor(Date.now() / 1000);
const notify = () => listeners.forEach((l) => l());

function start() {
  // Nothing left to count once the target has passed.
  if (timer || document.hidden || (target !== null && Date.now() >= target)) return;
  timer = setInterval(() => {
    notify();
    if (target !== null && Date.now() >= target) stop();
  }, 1000);
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}

// Pause while the tab is hidden; recompute from Date.now() on return so it never drifts.
function onVisibility() {
  if (document.hidden) stop();
  else {
    notify();
    start();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) document.addEventListener("visibilitychange", onVisibility);
  start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

/** Seconds since epoch on the client; null on the server and during hydration. */
function useNow() {
  return useSyncExternalStore(subscribe, nowSeconds, () => null);
}

/* ---------- Remaining time ---------- */

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingAt(now: number): Remaining | "live" {
  if (target === null) return "live";
  const left = Math.max(0, Math.floor(target / 1000) - now);
  if (left === 0) return "live";
  return {
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function spoken(r: Remaining) {
  const unit = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  return `${unit(r.days, "day")}, ${unit(r.hours, "hour")} and ${unit(r.minutes, "minute")} until launch`;
}

function useRemaining() {
  const now = useNow();
  return now === null ? null : remainingAt(now);
}

const staticDate = (
  <time dateTime={phaseOneLaunch.targetAt ?? undefined}>
    {phaseOneLaunch.displayDate} · {phaseOneLaunch.displayTime}
  </time>
);

/* ---------- Announcement bar variant ---------- */

/** Touch sizes: the link fills the bar height so it is tappable, not just the 16px text line. */
const barLink = "text-brand-soft hover:text-fg max-xl:inline-flex max-xl:min-h-9 max-xl:items-center max-xl:px-1";

/** Countdown text plus its CTA, which switches with the state. */
export function CountdownInline() {
  const r = useRemaining();

  if (r === "live") {
    return (
      <>
        <span className="md:hidden">Beta is live</span>
        <span className="hidden md:inline">{phaseOneLaunch.label} is live</span>
        <a href={phaseOneLaunch.ctaHref} className={barLink}>
          <span className="md:hidden">Validate →</span>
          <span className="hidden md:inline">{phaseOneLaunch.ctaLabel} →</span>
        </a>
      </>
    );
  }

  return (
    <>
      <span className="hidden md:inline">
        {phaseOneLaunch.label} launches {staticDate}
      </span>
      <span className="hidden text-faint md:inline">·</span>
      <span
        role="timer"
        aria-label={r ? spoken(r) : `Launches ${phaseOneLaunch.displayDate}`}
        className="text-fg tabular-nums"
      >
        {r ? (
          <>
            <span className="md:hidden">Beta in </span>
            {r.days}d {pad(r.hours)}h {pad(r.minutes)}m
            <span className="hidden md:inline"> {pad(r.seconds)}s</span>
          </>
        ) : (
          <span className="md:hidden">Beta · {phaseOneLaunch.displayDate}</span>
        )}
      </span>
      <a href={phaseOneLaunch.countdownCtaHref} className={barLink}>
        <span className="md:hidden">Join →</span>
        <span className="hidden md:inline">{phaseOneLaunch.scheduledCtaLabel} →</span>
      </a>
    </>
  );
}

/* ---------- Hero variant: unit tiles ---------- */

export function CountdownTiles() {
  const r = useRemaining();

  if (r === "live") {
    return (
      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/8 px-3.5 py-1.5 font-code text-xs text-mint">
        <span className="size-1.5 animate-blink rounded-full bg-mint" />
        {phaseOneLaunch.label} is live
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: r ? String(r.days) : "--" },
    { label: "HOURS", value: r ? pad(r.hours) : "--" },
    { label: "MIN", value: r ? pad(r.minutes) : "--" },
    { label: "SEC", value: r ? pad(r.seconds) : "--" },
  ];

  return (
    <div className="mt-8 flex flex-col items-center lg:mt-10">
      <div className="flex items-center gap-2 font-code text-[11px] tracking-[0.12em] text-brand">
        <span className="size-1.5 animate-blink rounded-full bg-mint" />
        {phaseOneLaunch.label.toUpperCase()} LAUNCHES IN
      </div>
      <div
        role="timer"
        aria-label={r ? spoken(r) : `Launches ${phaseOneLaunch.displayDate}`}
        className="mt-3.5 flex gap-1.5 min-[375px]:gap-2 sm:gap-3"
      >
        {units.map((u) => (
          <div
            key={u.label}
            className="flex w-[62px] flex-col items-center rounded-xl border border-line bg-panel py-2.5 min-[375px]:w-[68px] sm:w-[84px] sm:py-3"
          >
            <span aria-hidden="true" className="font-display text-[26px] leading-none text-fg tabular-nums sm:text-[32px]">
              {u.value}
            </span>
            <span aria-hidden="true" className="mt-1.5 font-code text-[10px] tracking-[0.08em] text-dim">
              {u.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 font-code text-[11px] max-xl:text-xs text-dim">{staticDate}</div>
    </div>
  );
}
