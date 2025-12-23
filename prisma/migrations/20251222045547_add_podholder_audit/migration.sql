-- AlterTable
ALTER TABLE "pod_holders" ADD COLUMN     "club_id" UUID;

-- CreateTable
CREATE TABLE "PodHolderAudit" (
    "audit_id" UUID NOT NULL,
    "pod_holder_id" UUID NOT NULL,
    "from_club_id" UUID,
    "to_club_id" UUID,
    "action" TEXT NOT NULL,
    "performed_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PodHolderAudit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateIndex
CREATE INDEX "pod_holders_club_id_idx" ON "pod_holders"("club_id");

-- AddForeignKey
ALTER TABLE "pod_holders" ADD CONSTRAINT "pod_holders_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("club_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodHolderAudit" ADD CONSTRAINT "PodHolderAudit_pod_holder_id_fkey" FOREIGN KEY ("pod_holder_id") REFERENCES "pod_holders"("pod_holder_id") ON DELETE RESTRICT ON UPDATE CASCADE;
