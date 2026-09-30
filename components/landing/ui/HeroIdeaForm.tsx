"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";

/** Shared with WaitlistForm, which still pre-fills an idea handed over in this session. */
export const waitlistIdeaStorageKey = "ai-swarm-waitlist-idea";
export const waitlistIdeaEvent = "ai-swarm:waitlist-idea";

const initialState = { status: "idle", message: "" } satisfies WaitlistState;

/**
 * Hero sign-up: saves the email with the same server action as the footer form and shows
 * the result right below, instead of scrolling the visitor to the bottom of the page.
 */
export function HeroIdeaForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const succeeded = state.status === "success";

  return (
    <form action={formAction} className="w-full max-w-[680px]" aria-busy={pending}>
      <input type="hidden" name="source" value="hero" />
      {/* Honeypot: invisible to people, filled in by bots; the action ignores those submissions. */}
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="hero-company">Company website</label>
        <input id="hero-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label htmlFor="hero-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 rounded-2xl border border-brand/30 bg-panel/90 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)] sm:flex-row">
        <input
          id="hero-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={320}
          disabled={pending || succeeded}
          placeholder="you@company.com"
          aria-describedby="hero-email-message"
          aria-invalid={state.status === "error"}
          className="min-h-12 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-4 text-base text-fg outline-none placeholder:text-dim focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={pending || succeeded}
          className="min-h-12 shrink-0 rounded-xl bg-brand-strong px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(124,111,247,0.3)] transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Joining…" : succeeded ? "You’re on the list ✓" : "Join the Private Beta →"}
        </button>
      </div>

      <p
        id="hero-email-message"
        aria-live="polite"
        className={`mt-3 min-h-5 text-center text-sm ${
          state.status === "error" ? "text-pink" : state.status === "success" ? "text-mint" : "text-dim"
        }`}
      >
        {state.message || "One launch email. No newsletter or spam."}
      </p>
    </form>
  );
}
