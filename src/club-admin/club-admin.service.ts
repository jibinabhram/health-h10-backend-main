import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../common/utils/password.util';

@Injectable()
export class ClubAdminService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const password_hash = await hashPassword(dto.password);
    return this.prisma.clubAdmin.create({
      data: {
        club_id: dto.club_id,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password_hash,
      },
    });
  }

  async updateByClubId(club_id: string, dto: any) {
    return this.prisma.clubAdmin.updateMany({
      where: { club_id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      },
    });
  }

  findAll() {
    return this.prisma.clubAdmin.findMany();
  }
}
