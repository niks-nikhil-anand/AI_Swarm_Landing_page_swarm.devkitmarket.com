"use client";

import { useActionState, useEffect, useState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { waitlistIdeaEvent, waitlistIdeaStorageKey } from "./HeroIdeaForm";

const initialWaitlistState = {
  status: "idle",
  message: "",
} satisfies WaitlistState;

export function WaitlistForm({ source = "landing_page" }: { source?: string }) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialWaitlistState);
  const [idea, setIdea] = useState("");
  const succeeded = state.status === "success";

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIdea(sessionStorage.getItem(waitlistIdeaStorageKey) ?? "");
    });

    const receiveIdea = (event: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === "string") {
        setIdea(event.detail);
      }
    };

    window.addEventListener(waitlistIdeaEvent, receiveIdea);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(waitlistIdeaEvent, receiveIdea);
    };
  }, []);

  return (
    <form action={formAction} className="w-full max-w-[590px]" aria-busy={pending}>
      <label htmlFor={`waitlist-email-${source}`} className="sr-only">
        Email address
      </label>
      <input type="hidden" name="source" value={source} />
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`company-${source}`}>Company website</label>
        <input id={`company-${source}`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor={`waitlist-idea-${source}`} className="sr-only">
        Your SaaS idea (optional)
      </label>
      <textarea
        id={`waitlist-idea-${source}`}
        name="idea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        maxLength={2_000}
        rows={2}
        disabled={pending || succeeded}
        placeholder="Your SaaS idea (optional)"
        className="mb-3 min-h-16 w-full resize-y sm:min-h-20 rounded-xl border border-line bg-ink/80 px-4 py-3 text-base text-fg outline-none transition-colors placeholder:text-dim focus:border-brand disabled:cursor-not-allowed disabled:opacity-70"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`waitlist-email-${source}`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={320}
          disabled={pending || succeeded}
          placeholder="you@company.com"
          aria-describedby={`waitlist-message-${source}`}
          aria-invalid={state.status === "error"}
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-ink/80 px-4 text-base text-fg outline-none transition-colors placeholder:text-dim focus:border-brand disabled:cursor-not-allowed disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={pending || succeeded}
          className="min-h-12 shrink-0 rounded-xl bg-brand-strong px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(124,111,247,0.3)] transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Joining…" : succeeded ? "You’re on the list" : "Notify me at launch →"}
        </button>
      </div>
      <p
        id={`waitlist-message-${source}`}
        aria-live="polite"
        className={`mt-3 min-h-5 text-center text-sm ${state.status === "error" ? "text-pink" : state.status === "success" ? "text-mint" : "text-dim"}`}
      >
        {state.message || "One launch email. No newsletter or spam."}
      </p>
    </form>
  );
}
