import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  /* ───────────────── CREATE ───────────────── */
  async create(super_admin_id: string, dto: any) {
    return this.prisma.$transaction(async tx => {
      const club = await tx.club.create({
        data: {
          super_admin_id,
          club_name: dto.club_name,
          address: dto.address,
          sport: dto.sport,
        },
      });

      const password_hash = await bcrypt.hash(dto.admin_password, 10);

      const admin = await tx.clubAdmin.create({
        data: {
          club_id: club.club_id,
          name: dto.admin_name,
          email: dto.admin_email,
          phone: dto.admin_phone,
          password_hash,
          temp_password: dto.admin_password,
        },
      });

      if (Array.isArray(dto.pod_holder_ids) && dto.pod_holder_ids.length > 0) {
        await tx.podHolder.updateMany({
          where: {
            pod_holder_id: { in: dto.pod_holder_ids },
            club_id: null,
          },
          data: {
            club_id: club.club_id,
          },
        });
      }

      return {
        message: 'Club & Admin created successfully',
        club,
        admin: {
          admin_id: admin.admin_id,
        },
      };
    });
  }

  /* ───────────────── DELETE ───────────────── */
  async delete(club_id: string) {
    return this.prisma.$transaction([
      this.prisma.podHolder.updateMany({
        where: { club_id },
        data: { club_id: null },
      }),

      this.prisma.player.deleteMany({
        where: { club_id },
      }),

      this.prisma.coach.deleteMany({
        where: { club_id },
      }),

      this.prisma.event.deleteMany({
        where: { club_id },
      }),

      this.prisma.subscription.deleteMany({
        where: { club_id },
      }),

      this.prisma.clubAdmin.deleteMany({
        where: { club_id },
      }),

      this.prisma.club.delete({
        where: { club_id },
      }),
    ]);
  }

  /* ───────────────── UPDATE ───────────────── */
  async update(club_id: string, dto: any) {
    return this.prisma.club.update({
      where: { club_id },
      data: {
        club_name: dto.club_name,
        address: dto.address,
        sport: dto.sport,
        status: dto.status ? dto.status.toLowerCase() : undefined,
      },
    });
  }



  /* ───────────────── UPDATE STATUS ONLY  ───────────────── */
    async updateStatus(club_id: string, status: 'ACTIVE' | 'INACTIVE') {
      return this.prisma.club.update({
        where: { club_id },
        data: {
          status: status.toLowerCase(), // "active" | "inactive"
        },
      });
    }

  /* ───────────────── FIND ALL (TABLE VIEW) ───────────────── */
  async findAll() {
    const clubs = await this.prisma.club.findMany({
      include: {
        club_admins: true,
        pod_holders: {
          include: {
            pods: true, // needed for pods_count
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return clubs.map(club => {
      const podsCount = club.pod_holders.reduce(
        (sum, holder) => sum + holder.pods.length,
        0
      );

      const admin =
        club.club_admins.length > 0
          ? {
              admin_id: club.club_admins[0].admin_id,
              name: club.club_admins[0].name,
              email: club.club_admins[0].email,
              phone: club.club_admins[0].phone,
              temp_password: club.club_admins[0].temp_password,
            }
          : null;

      return {
        club_id: club.club_id,
        club_name: club.club_name,
        address: club.address,
        sport: club.sport,
        status: (club.status ?? 'INACTIVE').toUpperCase(),

        admin,

        pod_holders: club.pod_holders.map(holder => ({
          pod_holder_id: holder.pod_holder_id,
          serial_number: holder.serial_number,
          model: holder.model,
          pods: holder.pods,
          pods_count: holder.pods.length,   // ✅ per holder
        })),

        pods_count: podsCount,              // ✅ existing
        total_pods: podsCount,              // ✅ frontend expects this
        podholders_count: club.pod_holders.length,
      };

    });


  }

  /* ================= UNASSIGNED POD HOLDERS ================= */
  async findUnassignedPodHolders() {
    return this.prisma.podHolder.findMany({
      where: {
        club_id: null,
      },
      select: {
        pod_holder_id: true,
        serial_number: true,
        model: true,
      },
      orderBy: { created_at: 'asc' },
    });
  }


  /* ================= GET AVAILABLE CLUBS ================= */
  async findAvailable() {
    const clubs = await this.prisma.club.findMany({
      where: {
        status: 'active',
      },
      include: {
        pod_holders: {
          include: {
            pods: true,
          },
        },
        club_admins: {
          select: {
            name: true,
            email: true,
            temp_password: true,
          },
        },
      },
      orderBy: {
        club_name: 'asc',
      },
    });

    return clubs.map(club => {
      const podsCount = club.pod_holders.reduce(
        (sum, holder) => sum + holder.pods.length,
        0,
      );

      return {
        club_id: club.club_id,
        club_name: club.club_name,

        // ✅ counts for listing / assign UI
        pods_count: podsCount,
        podholders_count: club.pod_holders.length,

        // ✅ useful for dropdown / edit context
        address: club.address,
        status: (club.status ?? 'INACTIVE').toUpperCase(),

        // ✅ admin info (used in PDF or details)
        admin:
          club.club_admins.length > 0
            ? {
                name: club.club_admins[0].name,
                email: club.club_admins[0].email,
                temp_password: club.club_admins[0].temp_password,
              }
            : null,
      };
    });
  }


  /* ───────────────── FIND ONE (DETAIL VIEW) ───────────────── */
  async findOne(id: string) {
    const club = await this.prisma.club.findUnique({
      where: { club_id: id },
      include: {
        club_admins: true,
        pod_holders: {
          include: {
            pods: true, // required for pods_count
          },
        },
      },
    });

    if (!club) return null;

    const podsCount = club.pod_holders.reduce(
      (sum, holder) => sum + holder.pods.length,
      0
    );

    const admin =
      club.club_admins.length > 0
        ? {
            admin_id: club.club_admins[0].admin_id,
            name: club.club_admins[0].name,
            email: club.club_admins[0].email,
            phone: club.club_admins[0].phone,
            temp_password: club.club_admins[0].temp_password,
          }
        : null;

    return {
      club_id: club.club_id,
      club_name: club.club_name,
      address: club.address,
      sport: club.sport,
      status: (club.status ?? 'INACTIVE').toUpperCase(),

      admin,

      pod_holders: club.pod_holders.map(holder => ({
        pod_holder_id: holder.pod_holder_id,
        serial_number: holder.serial_number,
        model: holder.model,
        pods: holder.pods,
        pods_count: holder.pods.length,   // ✅ per holder
      })),

      pods_count: podsCount,
      total_pods: podsCount,              // ✅ FIX
      podholders_count: club.pod_holders.length,
    };

  }
}