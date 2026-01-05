import { PodsService } from './pods.service';
import { CreatePodDto } from './dto/create-pod.dto';
export declare class PodsController {
    private readonly svc;
    constructor(svc: PodsService);
    create(dto: CreatePodDto): Promise<{
        data: {
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
        };
    }>;
    createBatch(body: {
        count: number;
        model?: string;
    }): Promise<{
        data: {
            batch_id: string;
            created: number;
        };
    }>;
    findAll(): Promise<{
        data: {
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
        }[];
    }>;
    findByBatch(batch_id: string): Promise<{
        data: {
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
        }[];
    }>;
    updateStatus(id: string, body: {
        status: 'ACTIVE' | 'ASSIGNED' | 'MAINTENANCE' | 'DAMAGED' | 'LOST';
    }): Promise<{
        data: {
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
        };
    }>;
}
