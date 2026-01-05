import { PrismaService } from '../prisma/prisma.service';
import { PodLifecycleStatus } from '@prisma/client';
export declare class PodsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: {
        model?: string;
    }): Promise<{
        created_at: Date;
        updated_at: Date;
        pod_holder_id: string | null;
        serial_number: string | null;
        model: string | null;
        pod_id: string;
        batch_id: string;
        device_id: string;
        firmware: string | null;
        lifecycle_status: import("@prisma/client").$Enums.PodLifecycleStatus;
    }>;
    createMany(count: number, model?: string): Promise<{
        batch_id: string;
        created: number;
    }>;
    findAll(): Promise<{
        created_at: Date;
        updated_at: Date;
        pod_holder_id: string | null;
        serial_number: string | null;
        model: string | null;
        pod_id: string;
        batch_id: string;
        device_id: string;
        firmware: string | null;
        lifecycle_status: import("@prisma/client").$Enums.PodLifecycleStatus;
    }[]>;
    findByBatch(batch_id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        pod_holder_id: string | null;
        serial_number: string | null;
        model: string | null;
        pod_id: string;
        batch_id: string;
        device_id: string;
        firmware: string | null;
        lifecycle_status: import("@prisma/client").$Enums.PodLifecycleStatus;
    }[]>;
    updateStatus(podId: string, status: PodLifecycleStatus): Promise<{
        created_at: Date;
        updated_at: Date;
        pod_holder_id: string | null;
        serial_number: string | null;
        model: string | null;
        pod_id: string;
        batch_id: string;
        device_id: string;
        firmware: string | null;
        lifecycle_status: import("@prisma/client").$Enums.PodLifecycleStatus;
    }>;
    private generateSerialNumber;
    private generateDeviceId;
}
