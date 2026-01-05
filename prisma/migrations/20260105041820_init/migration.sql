-- CreateEnum
CREATE TYPE "PodLifecycleStatus" AS ENUM ('ACTIVE', 'ASSIGNED', 'DAMAGED', 'LOST', 'REPLACED', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "PodReplacementReason" AS ENUM ('DAMAGED', 'LOST', 'UPGRADE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "PodHolderAction" AS ENUM ('ASSIGNED', 'UNASSIGNED', 'REASSIGNED');

-- CreateTable
CREATE TABLE "super_admins" (
    "super_admin_id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "profile_image" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "reset_token" VARCHAR(255),
    "reset_token_expires" TIMESTAMPTZ(6),
    "login_otp" VARCHAR(32),
    "login_otp_expires" TIMESTAMPTZ(6),

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("super_admin_id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "club_id" UUID NOT NULL,
    "super_admin_id" UUID,
    "club_name" TEXT,
    "address" TEXT,
    "status" TEXT DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sport" TEXT,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("club_id")
);

-- CreateTable
CREATE TABLE "club_admins" (
    "admin_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "password_hash" TEXT,
    "profile_image" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reset_token" VARCHAR(255),
    "reset_token_expires" TIMESTAMPTZ(6),
    "login_otp" VARCHAR(32),
    "login_otp_expires" TIMESTAMPTZ(6),

    CONSTRAINT "club_admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "coaches" (
    "coach_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "coach_name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "password_hash" TEXT,
    "role" TEXT,
    "coach_image" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reset_token" VARCHAR(255),
    "reset_token_expires" TIMESTAMPTZ(6),
    "login_otp" VARCHAR(32),
    "login_otp_expires" TIMESTAMPTZ(6),

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("coach_id")
);

-- CreateTable
CREATE TABLE "players" (
    "player_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "player_name" TEXT,
    "jersey_number" INTEGER,
    "age" INTEGER,
    "position" TEXT,
    "phone" TEXT,
    "player_image" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "players_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "pods" (
    "pod_id" UUID NOT NULL,
    "batch_id" VARCHAR(50) NOT NULL,
    "serial_number" TEXT,
    "device_id" TEXT NOT NULL,
    "model" TEXT,
    "firmware" TEXT,
    "pod_holder_id" UUID,
    "lifecycle_status" "PodLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pods_pkey" PRIMARY KEY ("pod_id")
);

-- CreateTable
CREATE TABLE "pod_holders" (
    "pod_holder_id" UUID NOT NULL,
    "serial_number" TEXT,
    "model" TEXT,
    "club_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pod_holders_pkey" PRIMARY KEY ("pod_holder_id")
);

-- CreateTable
CREATE TABLE "pod_holder_audits" (
    "audit_id" UUID NOT NULL,
    "pod_holder_id" UUID NOT NULL,
    "from_club_id" UUID,
    "to_club_id" UUID,
    "action" "PodHolderAction" NOT NULL,
    "performed_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pod_holder_audits_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "pod_replacement_audits" (
    "replacement_id" UUID NOT NULL,
    "pod_holder_id" UUID NOT NULL,
    "old_pod_id" UUID NOT NULL,
    "new_pod_id" UUID,
    "reason" "PodReplacementReason" NOT NULL,
    "performed_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pod_replacement_audits_pkey" PRIMARY KEY ("replacement_id")
);

-- CreateTable
CREATE TABLE "pod_allocations" (
    "allocation_id" UUID NOT NULL,
    "coach_id" UUID,
    "pod_id" UUID NOT NULL,
    "battery_level" INTEGER,
    "health_status" TEXT,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pod_allocations_pkey" PRIMARY KEY ("allocation_id")
);

-- CreateTable
CREATE TABLE "coach_assignments" (
    "assignment_id" UUID NOT NULL,
    "coach_id" UUID,
    "pod_id" UUID,
    "pod_holder_id" UUID,
    "player_id" UUID,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coach_assignments_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "player_pods" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "pod_id" UUID NOT NULL,
    "assigned_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_pods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_pod_holders" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "pod_holder_id" UUID NOT NULL,
    "assigned_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_pod_holders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pod_statuses" (
    "status_id" UUID NOT NULL,
    "pod_id" UUID NOT NULL,
    "working_status" TEXT,
    "battery_level" INTEGER,
    "last_sync" TIMESTAMP(3),
    "health_status" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pod_statuses_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "pod_holder_statuses" (
    "status_id" UUID NOT NULL,
    "pod_holder_id" UUID NOT NULL,
    "battery_level" INTEGER,
    "working_status" TEXT,
    "last_sync" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pod_holder_statuses_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "raw_data" (
    "raw_id" UUID NOT NULL,
    "pod_id" UUID NOT NULL,
    "player_id" UUID,
    "ts" TIMESTAMP(3),
    "acceleration_x" DOUBLE PRECISION,
    "acceleration_y" DOUBLE PRECISION,
    "acceleration_z" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "w" DOUBLE PRECISION,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "heart_rate" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_data_pkey" PRIMARY KEY ("raw_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "event_name" TEXT,
    "event_date" TIMESTAMP(3),
    "location" TEXT,
    "event_type" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "event_participants" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "coach_id" UUID,
    "player_id" UUID,

    CONSTRAINT "event_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "plan_id" UUID NOT NULL,
    "name" TEXT,
    "price_cents" INTEGER,
    "duration_days" INTEGER,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "subscription_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "plan_id" UUID,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" TEXT DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "amount_cents" INTEGER,
    "paid_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT,
    "transaction_ref" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "service_requests" (
    "request_id" UUID NOT NULL,
    "club_id" UUID,
    "requester_id" TEXT,
    "description" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "activity_metrics" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "total_distance" DOUBLE PRECISION,
    "hsr_distance" DOUBLE PRECISION,
    "sprint_distance" DOUBLE PRECISION,
    "top_speed" DOUBLE PRECISION,
    "sprint_count" INTEGER,
    "acceleration" DOUBLE PRECISION,
    "deceleration" DOUBLE PRECISION,
    "max_acceleration" DOUBLE PRECISION,
    "max_deceleration" DOUBLE PRECISION,
    "player_load" DOUBLE PRECISION,
    "power_score" DOUBLE PRECISION,
    "hr_max" INTEGER,
    "time_in_red_zone" DOUBLE PRECISION,
    "percent_in_red_zone" DOUBLE PRECISION,
    "hr_recovery_time" DOUBLE PRECISION,
    "recorded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_email_key" ON "super_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "club_admins_email_key" ON "club_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coaches_email_key" ON "coaches"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pods_serial_number_key" ON "pods"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "pods_device_id_key" ON "pods"("device_id");

-- CreateIndex
CREATE INDEX "pods_pod_holder_id_idx" ON "pods"("pod_holder_id");

-- CreateIndex
CREATE UNIQUE INDEX "pod_holders_serial_number_key" ON "pod_holders"("serial_number");

-- CreateIndex
CREATE INDEX "pod_holders_club_id_idx" ON "pod_holders"("club_id");

-- CreateIndex
CREATE INDEX "pod_holder_audits_pod_holder_id_idx" ON "pod_holder_audits"("pod_holder_id");

-- CreateIndex
CREATE INDEX "pod_replacement_audits_pod_holder_id_idx" ON "pod_replacement_audits"("pod_holder_id");

-- CreateIndex
CREATE INDEX "pod_replacement_audits_old_pod_id_idx" ON "pod_replacement_audits"("old_pod_id");

-- CreateIndex
CREATE INDEX "pod_allocations_coach_id_idx" ON "pod_allocations"("coach_id");

-- CreateIndex
CREATE INDEX "pod_allocations_pod_id_idx" ON "pod_allocations"("pod_id");

-- CreateIndex
CREATE INDEX "coach_assignments_coach_id_idx" ON "coach_assignments"("coach_id");

-- CreateIndex
CREATE INDEX "coach_assignments_player_id_idx" ON "coach_assignments"("player_id");

-- CreateIndex
CREATE INDEX "player_pods_player_id_idx" ON "player_pods"("player_id");

-- CreateIndex
CREATE INDEX "player_pods_pod_id_idx" ON "player_pods"("pod_id");

-- CreateIndex
CREATE INDEX "player_pod_holders_player_id_idx" ON "player_pod_holders"("player_id");

-- CreateIndex
CREATE INDEX "player_pod_holders_pod_holder_id_idx" ON "player_pod_holders"("pod_holder_id");

-- CreateIndex
CREATE INDEX "pod_statuses_pod_id_idx" ON "pod_statuses"("pod_id");

-- CreateIndex
CREATE INDEX "pod_holder_statuses_pod_holder_id_idx" ON "pod_holder_statuses"("pod_holder_id");

-- CreateIndex
CREATE INDEX "raw_data_pod_id_idx" ON "raw_data"("pod_id");

-- CreateIndex
CREATE INDEX "raw_data_player_id_idx" ON "raw_data"("player_id");

-- CreateIndex
CREATE INDEX "raw_data_ts_idx" ON "raw_data"("ts");

-- CreateIndex
CREATE INDEX "event_participants_event_id_idx" ON "event_participants"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_ref_key" ON "payments"("transaction_ref");

-- CreateIndex
CREATE INDEX "activity_metrics_player_id_idx" ON "activity_metrics"("player_id");

-- CreateIndex
CREATE INDEX "activity_metrics_recorded_at_idx" ON "activity_metrics"("recorded_at");

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_super_admin_id_fkey" FOREIGN KEY ("super_admin_id") REFERENCES "super_admins"("super_admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_admins" ADD CONSTRAINT "club_admins_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pods" ADD CONSTRAINT "pods_pod_holder_id_fkey" FOREIGN KEY ("pod_holder_id") REFERENCES "pod_holders"("pod_holder_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_holders" ADD CONSTRAINT "pod_holders_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_holder_audits" ADD CONSTRAINT "pod_holder_audits_pod_holder_id_fkey" FOREIGN KEY ("pod_holder_id") REFERENCES "pod_holders"("pod_holder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_replacement_audits" ADD CONSTRAINT "pod_replacement_audits_new_pod_id_fkey" FOREIGN KEY ("new_pod_id") REFERENCES "pods"("pod_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_replacement_audits" ADD CONSTRAINT "pod_replacement_audits_old_pod_id_fkey" FOREIGN KEY ("old_pod_id") REFERENCES "pods"("pod_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_replacement_audits" ADD CONSTRAINT "pod_replacement_audits_pod_holder_id_fkey" FOREIGN KEY ("pod_holder_id") REFERENCES "pod_holders"("pod_holder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_allocations" ADD CONSTRAINT "pod_allocations_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("coach_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_allocations" ADD CONSTRAINT "pod_allocations_pod_id_fkey" FOREIGN KEY ("pod_id") REFERENCES "pods"("pod_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("coach_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_pod_holder_id_fkey" FOREIGN KEY ("pod_holder_id") REFERENCES "pod_holders"("pod_holder_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_pod_id_fkey" FOREIGN KEY ("pod_id") REFERENCES "pods"("pod_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_pods" ADD CONSTRAINT "player_pods_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_pods" ADD CONSTRAINT "player_pods_pod_id_fkey" FOREIGN KEY ("pod_id") REFERENCES "pods"("pod_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_pod_holders" ADD CONSTRAINT "player_pod_holders_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_pod_holders" ADD CONSTRAINT "player_pod_holders_pod_holder_id_fkey" FOREIGN KEY ("pod_holder_id") REFERENCES "pod_holders"("pod_holder_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_statuses" ADD CONSTRAINT "pod_statuses_pod_id_fkey" FOREIGN KEY ("pod_id") REFERENCES "pods"("pod_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pod_holder_statuses" ADD CONSTRAINT "pod_holder_statuses_pod_holder_id_fkey" FOREIGN KEY ("pod_holder_id") REFERENCES "pod_holders"("pod_holder_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_data" ADD CONSTRAINT "raw_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_data" ADD CONSTRAINT "raw_data_pod_id_fkey" FOREIGN KEY ("pod_id") REFERENCES "pods"("pod_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("coach_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "payment_plans"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("subscription_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_metrics" ADD CONSTRAINT "activity_metrics_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;
