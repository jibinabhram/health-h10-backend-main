/*
  Warnings:

  - A unique constraint covering the columns `[pod_id]` on the table `player_pods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "exercise_types" (
    "exercise_type_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "event_type" TEXT NOT NULL DEFAULT 'training',
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_types_pkey" PRIMARY KEY ("exercise_type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_pods_pod_id_key" ON "player_pods"("pod_id");

-- AddForeignKey
ALTER TABLE "exercise_types" ADD CONSTRAINT "exercise_types_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE CASCADE ON UPDATE CASCADE;
