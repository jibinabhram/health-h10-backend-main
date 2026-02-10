-- AddForeignKey
ALTER TABLE "activity_metrics" ADD CONSTRAINT "activity_metrics_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "events"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;
