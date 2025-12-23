import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

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

      await tx.clubAdmin.create({
        data: {
          club_id: club.club_id,
          name: dto.admin_name,
          email: dto.admin_email,
          phone: dto.admin_phone,
          password_hash,
        },
      });

      if (Array.isArray(dto.pod_holder_ids) && dto.pod_holder_ids.length > 0) {
        await tx.podHolder.updateMany({
          where: {
            pod_holder_id: { in: dto.pod_holder_ids },
            club_id: null, // SAFETY: prevent reassignment
          },
          data: {
            club_id: club.club_id,
          },
        });
      }

      return {
        message: 'Club & Admin created successfully',
        club: await tx.club.findUnique({
          where: { club_id: club.club_id },
          include: { pod_holders: true },
        }),
      };
    });
  }

  // ───────────────── DELETE ─────────────────
  async delete(club_id: string) {
    // 🔴 TRANSACTION ADDED
    return this.prisma.$transaction(async tx => {
      // 🔴 UNASSIGN POD HOLDERS FIRST
      await tx.podHolder.updateMany({
        where: { club_id },
        data: { club_id: null },
      });

      await tx.clubAdmin.deleteMany({
        where: { club_id },
      });

      return tx.club.delete({
        where: { club_id },
      });
    });
  }

  async update(club_id: string, dto: any) {
    return this.prisma.club.update({
      where: { club_id },
      data: {
        club_name: dto.club_name,
        address: dto.address,
        sport: dto.sport,
        status: dto.status,
      },
    });
  }

  async findAll() {
    const clubs = await this.prisma.club.findMany({
      include: {
        pod_holders: {
          select: {
            pod_holder_id: true,
            serial_number: true,
            model: true,
          },
        },
        club_admins: true,
      },
    });

    return clubs.map(club => ({
      club_id: club.club_id,
      club_name: club.club_name,
      address: club.address,
      sport: club.sport,
      status: club.status,

      pod_holders: club.pod_holders,

      admin:
        club.club_admins.length > 0
          ? {
              admin_id: club.club_admins[0].admin_id,
              name: club.club_admins[0].name,
              email: club.club_admins[0].email,
              phone: club.club_admins[0].phone,
            }
          : null,
    }));
  }

  async findOne(id: string) {
    const club = await this.prisma.club.findUnique({
      where: { club_id: id },
      include: {
        pod_holders: {
          select: {
            pod_holder_id: true,
            serial_number: true,
            model: true,
          },
        },
        club_admins: true,
      },
    });

    if (!club) return null;

    // ✅ MATCH findAll() RESPONSE SHAPE
    return {
      club_id: club.club_id,
      club_name: club.club_name,
      address: club.address,
      sport: club.sport,
      status: club.status,
      pod_holders: club.pod_holders,
      admin:
        club.club_admins.length > 0
          ? {
              admin_id: club.club_admins[0].admin_id,
              name: club.club_admins[0].name,
              email: club.club_admins[0].email,
              phone: club.club_admins[0].phone,
            }
          : null,
    };
  }
}
