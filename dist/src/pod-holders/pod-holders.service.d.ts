import { PrismaService } from '../prisma/prisma.service';
import { CreatePodHolderDto } from './dto/create-pod-holder.dto';
export declare class PodHoldersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePodHolderDto): import("@prisma/client").Prisma.Prisma__PodHolderClient<{
        created_at: Date;
        updated_at: Date;
        club_id: string | null;
        pod_holder_id: string;
        serial_number: string | null;
        model: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        created_at: Date;
        updated_at: Date;
        club_id: string | null;
        pod_holder_id: string;
        serial_number: string | null;
        model: string | null;
    }[]>;
    findAvailable(): import("@prisma/client").Prisma.PrismaPromise<{
        created_at: Date;
        updated_at: Date;
        club_id: string | null;
        pod_holder_id: string;
        serial_number: string | null;
        model: string | null;
    }[]>;
    findOne(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        club_id: string | null;
        pod_holder_id: string;
        serial_number: string | null;
        model: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignPodHolderToClub(podHolderId: string, clubId: string, performedBy: string): Promise<void>;
    unassignPodHolder(podHolderId: string, performedBy: string): Promise<void>;
}
