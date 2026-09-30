"use client";

import { useState } from "react";

export const waitlistIdeaStorageKey = "ai-swarm-waitlist-idea";
export const waitlistIdeaEvent = "ai-swarm:waitlist-idea";

export function HeroIdeaForm() {
  const [idea, setIdea] = useState("");

  function continueToWaitlist() {
    const normalizedIdea = idea.trim().slice(0, 2_000);

    if (normalizedIdea) {
      sessionStorage.setItem(waitlistIdeaStorageKey, normalizedIdea);
      window.dispatchEvent(new CustomEvent(waitlistIdeaEvent, { detail: normalizedIdea }));
    }

    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="w-full max-w-[680px]">
      <label htmlFor="hero-idea" className="sr-only">
        Describe your SaaS idea
      </label>
      <div className="flex flex-col gap-3 rounded-2xl border border-brand/30 bg-panel/90 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)] sm:flex-row">
        <input
          id="hero-idea"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") continueToWaitlist();
          }}
          maxLength={2_000}
          placeholder="Describe your SaaS idea…"
          className="min-h-12 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-4 text-base text-fg outline-none placeholder:text-dim focus-visible:ring-2 focus-visible:ring-brand"
        />
        <button
          type="button"
          onClick={continueToWaitlist}
          className="min-h-12 shrink-0 rounded-xl bg-brand-strong px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(124,111,247,0.3)] transition-colors hover:bg-brand"
        >
          Join the Private Beta →
        </button>
      </div>
    </div>
  );
}
