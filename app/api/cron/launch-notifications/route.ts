import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { phaseOneLaunch } from "@/components/landing/data/launch";
import { getPrisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

const subscriberLimit = 1_000;
const emailBatchSize = 100;

type Subscriber = {
  id: string;
  email: string;
};

async function sendLaunchBatch(subscribers: Subscriber[], apiKey: string, from: string) {
  const prisma = getPrisma();
  const ids = subscribers.map(({ id }) => id);

  await prisma.waitlistSubscriber.updateMany({
    where: { id: { in: ids } },
    data: {
      notificationAttempts: { increment: 1 },
      lastNotificationError: null,
    },
  });

  try {
    const idempotencyKey = createHash("sha256").update(ids.join(":"), "utf8").digest("hex");
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `phase-one-launch/${idempotencyKey}`,
      },
      body: JSON.stringify(
        subscribers.map(({ email }) => ({
          from,
          to: [email],
          subject: "AI Swarm is live",
          html: `<p>AI Swarm is now live.</p><p>Research your market, validate your idea, and turn the evidence into an actionable product plan.</p><p><a href="${site.url}">Start with AI Swarm</a></p>`,
          text: `AI Swarm is now live. Research your market, validate your idea, and turn the evidence into an actionable product plan. Start here: ${site.url}`,
        })),
      ),
    });

    if (!response.ok) {
      throw new Error(`Resend returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
    }

    await prisma.waitlistSubscriber.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "NOTIFIED",
        notifiedAt: new Date(),
        lastNotificationError: null,
      },
    });

    return subscribers.length;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown notification error";

    await prisma.waitlistSubscriber.updateMany({
      where: { id: { in: ids } },
      data: { lastNotificationError: message.slice(0, 500) },
    });

    return 0;
  }
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "Cron is not configured." }, { status: 503 });
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const launchAt = phaseOneLaunch.targetAt ? new Date(phaseOneLaunch.targetAt) : null;

  if (!launchAt || Number.isNaN(launchAt.getTime())) {
    return NextResponse.json({ error: "Launch date is not configured." }, { status: 503 });
  }

  if (Date.now() < launchAt.getTime()) {
    return NextResponse.json({ skipped: true, reason: "Launch date has not arrived." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LAUNCH_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json({ error: "Launch email is not configured." }, { status: 503 });
  }

  const prisma = getPrisma();
  const subscribers = await prisma.waitlistSubscriber.findMany({
    where: { status: "PENDING", notifiedAt: null },
    select: { id: true, email: true },
    orderBy: { createdAt: "asc" },
    take: subscriberLimit,
  });

  let sent = 0;
  let failed = 0;

  for (let index = 0; index < subscribers.length; index += emailBatchSize) {
    const batch = subscribers.slice(index, index + emailBatchSize);
    const batchSent = await sendLaunchBatch(batch, apiKey, from);
    sent += batchSent;
    failed += batch.length - batchSent;
  }

  const remaining = await prisma.waitlistSubscriber.count({
    where: { status: "PENDING", notifiedAt: null },
  });

  return NextResponse.json({ eligible: subscribers.length, sent, failed, remaining });
}
