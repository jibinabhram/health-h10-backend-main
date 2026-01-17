/*
  Warnings:

  - You are about to drop the column `hrMax` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `hrRecoveryTime` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `hsrDistance` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `maxAcceleration` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `maxDeceleration` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `percentInRedZone` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `playerLoad` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `powerScore` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `sprintCount` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `sprintDistance` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `timeInRedZone` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `topSpeed` on the `activity_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `totalDistance` on the `activity_metrics` table. All the data in the column will be lost.
  - The `player_id` column on the `coach_assignments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `player_id` column on the `event_participants` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `player_id` column on the `raw_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[device_id]` on the table `pod_holders` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `player_id` on the `activity_metrics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `player_id` on the `player_pod_holders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `player_id` on the `player_pods` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `player_id` on the `players` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "PodLifecycleStatus" ADD VALUE 'REPAIRED';

-- DropForeignKey
ALTER TABLE "coach_assignments" DROP CONSTRAINT "coach_assignments_player_id_fkey";

-- DropForeignKey
ALTER TABLE "event_participants" DROP CONSTRAINT "event_participants_player_id_fkey";

-- DropForeignKey
ALTER TABLE "player_pod_holders" DROP CONSTRAINT "player_pod_holders_player_id_fkey";

-- DropForeignKey
ALTER TABLE "player_pods" DROP CONSTRAINT "player_pods_player_id_fkey";

-- DropForeignKey
ALTER TABLE "raw_data" DROP CONSTRAINT "raw_data_player_id_fkey";

-- AlterTable
ALTER TABLE "activity_metrics" DROP COLUMN "hrMax",
DROP COLUMN "hrRecoveryTime",
DROP COLUMN "hsrDistance",
DROP COLUMN "maxAcceleration",
DROP COLUMN "maxDeceleration",
DROP COLUMN "percentInRedZone",
DROP COLUMN "playerLoad",
DROP COLUMN "powerScore",
DROP COLUMN "sprintCount",
DROP COLUMN "sprintDistance",
DROP COLUMN "timeInRedZone",
DROP COLUMN "topSpeed",
DROP COLUMN "totalDistance",
ADD COLUMN     "hr_max" INTEGER,
ADD COLUMN     "hr_recovery_time" DOUBLE PRECISION,
ADD COLUMN     "hsr_distance" DOUBLE PRECISION,
ADD COLUMN     "max_acceleration" DOUBLE PRECISION,
ADD COLUMN     "max_deceleration" DOUBLE PRECISION,
ADD COLUMN     "percent_in_red_zone" DOUBLE PRECISION,
ADD COLUMN     "player_load" DOUBLE PRECISION,
ADD COLUMN     "power_score" DOUBLE PRECISION,
ADD COLUMN     "sprint_count" INTEGER,
ADD COLUMN     "sprint_distance" DOUBLE PRECISION,
ADD COLUMN     "time_in_red_zone" DOUBLE PRECISION,
ADD COLUMN     "top_speed" DOUBLE PRECISION,
ADD COLUMN     "total_distance" DOUBLE PRECISION,
DROP COLUMN "player_id",
ADD COLUMN     "player_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "coach_assignments" DROP COLUMN "player_id",
ADD COLUMN     "player_id" UUID;

-- AlterTable
ALTER TABLE "event_participants" DROP COLUMN "player_id",
ADD COLUMN     "player_id" UUID;

-- AlterTable
ALTER TABLE "player_pod_holders" DROP COLUMN "player_id",
ADD COLUMN     "player_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "player_pods" DROP COLUMN "player_id",
ADD COLUMN     "player_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "players" DROP CONSTRAINT "players_pkey",
DROP COLUMN "player_id",
ADD COLUMN     "player_id" UUID NOT NULL,
ADD CONSTRAINT "players_pkey" PRIMARY KEY ("player_id");

-- AlterTable
ALTER TABLE "pod_holders" ADD COLUMN     "device_id" TEXT;

-- AlterTable
ALTER TABLE "raw_data" DROP COLUMN "player_id",
ADD COLUMN     "player_id" UUID;

-- CreateIndex
CREATE INDEX "activity_metrics_player_id_idx" ON "activity_metrics"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_metrics_session_id_player_id_key" ON "activity_metrics"("session_id", "player_id");

-- CreateIndex
CREATE INDEX "coach_assignments_player_id_idx" ON "coach_assignments"("player_id");

-- CreateIndex
CREATE INDEX "player_pod_holders_player_id_idx" ON "player_pod_holders"("player_id");

-- CreateIndex
CREATE INDEX "player_pods_player_id_idx" ON "player_pods"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "pod_holders_device_id_key" ON "pod_holders"("device_id");

-- CreateIndex
CREATE INDEX "raw_data_player_id_idx" ON "raw_data"("player_id");

-- AddForeignKey
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_pods" ADD CONSTRAINT "player_pods_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_pod_holders" ADD CONSTRAINT "player_pod_holders_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_data" ADD CONSTRAINT "raw_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_metrics" ADD CONSTRAINT "activity_metrics_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;
