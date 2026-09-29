-- CreateEnum
CREATE TYPE "WaitlistStatus" AS ENUM ('PENDING', 'NOTIFIED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "waitlist_subscribers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "source" VARCHAR(64),
    "status" "WaitlistStatus" NOT NULL DEFAULT 'PENDING',
    "consented_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notified_at" TIMESTAMP(3),
    "notification_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_notification_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waitlist_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_subscribers_email_key" ON "waitlist_subscribers"("email");

-- CreateIndex
CREATE INDEX "waitlist_subscribers_status_notified_at_idx" ON "waitlist_subscribers"("status", "notified_at");
