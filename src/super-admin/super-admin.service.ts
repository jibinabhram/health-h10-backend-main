import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../common/utils/password.util';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const password_hash = await hashPassword(dto.password);
    const created = await this.prisma.superAdmin.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password_hash,
      },
    });
    delete (created as any).password_hash;
    return created;
  }

  async findAll() {
    const list = await this.prisma.superAdmin.findMany();
    return list.map((x) => {
      const copy = { ...x };
      delete (copy as any).password_hash;
      return copy;
    });
  }

  async findOne(id: string) {
    const r = await this.prisma.superAdmin.findUnique({ where: { super_admin_id: id } });
    if (!r) return null;
    delete (r as any).password_hash;
    return r;
  }

  async updateProfileImage(id: string, filename: string) {
    return this.prisma.superAdmin.update({
      where: { super_admin_id: id },
      data: { profile_image: filename },
    });
  }
  async updateProfile(id: string, dto: UpdateSuperAdminDto) {
  const updated = await this.prisma.superAdmin.update({
    where: { super_admin_id: id },
    data: {
      // Prisma ignores undefined, only updates what you send
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      profile_image: dto.profile_image,
    },
  });

  delete (updated as any).password_hash;
  return updated;
}
  async getDashboardStats() {
    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // CURRENT TOTALS
    const [totalClubs, totalPodholders, totalPods] = await Promise.all([
      this.prisma.club.count(),
      this.prisma.podHolder.count(),
      this.prisma.pod.count(),
    ]);

    // LAST MONTH TOTALS
    const [lastMonthClubs, lastMonthPodholders, lastMonthPods] =
      await Promise.all([
        this.prisma.club.count({
          where: { created_at: { lt: startOfThisMonth } },
        }),
        this.prisma.podHolder.count({
          where: { created_at: { lt: startOfThisMonth } },
        }),
        this.prisma.pod.count({
          where: { created_at: { lt: startOfThisMonth } },
        }),
      ]);

    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return 100;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalClubs,
      totalPodholders,
      totalPods,
      clubGrowth: calcGrowth(totalClubs, lastMonthClubs),
      podholderGrowth: calcGrowth(totalPodholders, lastMonthPodholders),
      podGrowth: calcGrowth(totalPods, lastMonthPods),
    };
  }


}