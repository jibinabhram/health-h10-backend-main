-- DropForeignKey
ALTER TABLE "activity_metrics" DROP CONSTRAINT "activity_metrics_session_id_fkey";

-- AlterTable
ALTER TABLE "activity_metrics" ALTER COLUMN "session_id" DROP NOT NULL;
