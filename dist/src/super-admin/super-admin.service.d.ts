import { PrismaService } from '../prisma/prisma.service';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
export declare class SuperAdminService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        super_admin_id: string;
        email: string;
        name: string | null;
        phone: string | null;
        password_hash: string;
        profile_image: string | null;
        created_at: Date;
        updated_at: Date;
        reset_token: string | null;
        reset_token_expires: Date | null;
        login_otp: string | null;
        login_otp_expires: Date | null;
    }>;
    findAll(): Promise<{
        super_admin_id: string;
        email: string;
        name: string | null;
        phone: string | null;
        password_hash: string;
        profile_image: string | null;
        created_at: Date;
        updated_at: Date;
        reset_token: string | null;
        reset_token_expires: Date | null;
        login_otp: string | null;
        login_otp_expires: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        super_admin_id: string;
        email: string;
        name: string | null;
        phone: string | null;
        password_hash: string;
        profile_image: string | null;
        created_at: Date;
        updated_at: Date;
        reset_token: string | null;
        reset_token_expires: Date | null;
        login_otp: string | null;
        login_otp_expires: Date | null;
    } | null>;
    updateProfileImage(id: string, filename: string): Promise<{
        super_admin_id: string;
        email: string;
        name: string | null;
        phone: string | null;
        password_hash: string;
        profile_image: string | null;
        created_at: Date;
        updated_at: Date;
        reset_token: string | null;
        reset_token_expires: Date | null;
        login_otp: string | null;
        login_otp_expires: Date | null;
    }>;
    updateProfile(id: string, dto: UpdateSuperAdminDto): Promise<{
        super_admin_id: string;
        email: string;
        name: string | null;
        phone: string | null;
        password_hash: string;
        profile_image: string | null;
        created_at: Date;
        updated_at: Date;
        reset_token: string | null;
        reset_token_expires: Date | null;
        login_otp: string | null;
        login_otp_expires: Date | null;
    }>;
}
