/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "file_end_ts" BIGINT,
ADD COLUMN     "file_start_ts" BIGINT,
ADD COLUMN     "session_id" TEXT,
ADD COLUMN     "trim_end_ts" BIGINT,
ADD COLUMN     "trim_start_ts" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "events_session_id_key" ON "events"("session_id");

-- AddForeignKey
ALTER TABLE "activity_metrics" ADD CONSTRAINT "activity_metrics_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "events"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
