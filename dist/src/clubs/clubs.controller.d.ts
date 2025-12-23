import type { Request } from 'express';
import { ClubsService } from './clubs.service';
export declare class ClubsController {
    private readonly svc;
    constructor(svc: ClubsService);
    create(req: Request, dto: any): Promise<{
        message: string;
        club: ({
            pod_holders: {
                created_at: Date;
                updated_at: Date;
                club_id: string | null;
                pod_holder_id: string;
                serial_number: string | null;
                model: string | null;
            }[];
        } & {
            super_admin_id: string | null;
            created_at: Date;
            updated_at: Date;
            club_id: string;
            club_name: string | null;
            address: string | null;
            status: string | null;
            sport: string | null;
        }) | null;
    }>;
    delete(id: string): Promise<{
        super_admin_id: string | null;
        created_at: Date;
        updated_at: Date;
        club_id: string;
        club_name: string | null;
        address: string | null;
        status: string | null;
        sport: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        super_admin_id: string | null;
        created_at: Date;
        updated_at: Date;
        club_id: string;
        club_name: string | null;
        address: string | null;
        status: string | null;
        sport: string | null;
    }>;
    findAll(): Promise<{
        club_id: string;
        club_name: string | null;
        address: string | null;
        sport: string | null;
        status: string | null;
        pod_holders: {
            pod_holder_id: string;
            serial_number: string | null;
            model: string | null;
        }[];
        admin: {
            admin_id: string;
            name: string | null;
            email: string | null;
            phone: string | null;
        } | null;
    }[]>;
    findOne(id: string): Promise<{
        club_id: string;
        club_name: string | null;
        address: string | null;
        sport: string | null;
        status: string | null;
        pod_holders: {
            pod_holder_id: string;
            serial_number: string | null;
            model: string | null;
        }[];
        admin: {
            admin_id: string;
            name: string | null;
            email: string | null;
            phone: string | null;
        } | null;
    } | null>;
}
