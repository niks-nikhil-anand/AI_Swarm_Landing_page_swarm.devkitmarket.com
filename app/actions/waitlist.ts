"use server";

import { getPrisma } from "@/lib/prisma";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sourcePattern = /^[a-z0-9_-]{1,64}$/;

export async function joinWaitlist(
  _previousState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const honeypot = String(formData.get("company") ?? "").trim();

  if (honeypot) {
    return {
      status: "success",
      message: "You’re on the list. We’ll email you when AI Swarm launches.",
    };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const idea = String(formData.get("idea") ?? "").trim();
  const requestedSource = String(formData.get("source") ?? "landing_page");
  const source = sourcePattern.test(requestedSource) ? requestedSource : "landing_page";

  if (!email || email.length > 320 || !emailPattern.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  if (idea.length > 2_000) {
    return { status: "error", message: "Keep your idea under 2,000 characters." };
  }

  try {
    await getPrisma().waitlistSubscriber.upsert({
      where: { email },
      update: { source, ...(idea ? { idea } : {}) },
      create: { email, source, idea: idea || null },
    });

    return {
      status: "success",
      message: "You’re on the list. We’ll email you when AI Swarm launches.",
    };
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return {
      status: "error",
      message: "We couldn’t save your email. Please try again in a moment.",
    };
  }
}
