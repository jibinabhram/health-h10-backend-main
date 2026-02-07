import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) { }

  async createPlayer(
    clubAdminId: string,
    clubId: string,
    dto: CreatePlayerDto,
  ) {
    return this.prisma.$transaction(async tx => {

      // ✅ 0️⃣ Validate club admin
      const admin = await tx.clubAdmin.findFirst({
        where: {
          admin_id: clubAdminId,
          club_id: clubId,
        },
      });

      if (!admin) {
        throw new BadRequestException('Invalid club admin');
      }

      // 1️⃣ Create player
      let player;

      try {
        // 1️⃣ Create player
        player = await tx.player.create({
          data: {
            club_id: clubId,
            player_name: dto.player_name,
            age: dto.age,
            jersey_number: dto.jersey_number,
            position: dto.position,
            phone: dto.phone,
            heartrate: dto.heartrate,
            height: dto.height,
            weight: dto.weight,
          },
        });
      } catch (e: any) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          throw new BadRequestException(
            'Jersey number already exists in this club',
          );
        }
        throw e;
      }

      // 3️⃣ Assign pod (optional)
      if (dto.pod_id) {

        // 🔒 1. Check if pod is already assigned
        const existingAssignment = await tx.playerPod.findFirst({
          where: { pod_id: dto.pod_id },
        });

        if (existingAssignment) {
          throw new BadRequestException(
            'This pod is already assigned to another player',
          );
        }

        // 🔍 2. Validate pod belongs to club
        const pod = await tx.pod.findFirst({
          where: {
            pod_id: dto.pod_id,
          },
          include: {
            pod_holder: true,
          },
        });

        if (!pod || !pod.pod_holder) {
          throw new BadRequestException('Invalid pod');
        }

        if (pod.pod_holder.club_id !== clubId) {
          throw new BadRequestException(
            'Pod does not belong to your club',
          );
        }

        // 🔗 3. Assign pod to player
        await tx.playerPod.create({
          data: {
            player_id: player.player_id,
            pod_id: dto.pod_id,
          },
        });
      }
      return player;
    });
  }

  async findPlayersByClub(clubId: string) {
    return this.prisma.player.findMany({
      where: { club_id: clubId },
      include: {
        club: true, // ✅ REQUIRED for club name

        player_pods: {
          include: {
            pod: {
              include: {
                pod_holder: true, // ✅ REQUIRED for pod holder
              },
            },
          },
        },
        hr_zones: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async updatePlayer(
    clubAdminId: string,
    clubId: string,
    playerId: string,
    dto: any,
  ) {
    // validate admin
    const admin = await this.prisma.clubAdmin.findFirst({ where: { admin_id: clubAdminId, club_id: clubId } });
    if (!admin) throw new BadRequestException('Invalid club admin');

    // ensure player belongs to club
    const player = await this.prisma.player.findUnique({ where: { player_id: playerId } });
    if (!player || player.club_id !== clubId) throw new BadRequestException('Player not found');

    return this.prisma.$transaction(async tx => {
      try {
        // Extract hr_zones from dto (do not pass to player.update)
        const { hr_zones, ...playerData } = dto;

        // Update player
        const updated = await tx.player.update({
          where: { player_id: playerId },
          data: playerData,
          include: {
            player_pods: { include: { pod: { include: { pod_holder: true } } } },
            club: true,
            hr_zones: true,
          },
        });

        // Handle hr_zones if provided
        if (hr_zones && Array.isArray(hr_zones)) {
          // Delete existing zones for this player
          await tx.hrZone.deleteMany({ where: { player_id: playerId } });

          // Create new zones
          for (const zone of hr_zones) {
            await tx.hrZone.create({
              data: {
                player_id: playerId,
                zone_number: zone.zone || zone.zone_number,
                min_hr: zone.min || zone.min_hr,
                max_hr: zone.max || zone.max_hr,
              },
            });
          }
        }

        // Re-fetch to include updated zones
        return tx.player.findUnique({
          where: { player_id: playerId },
          include: {
            player_pods: { include: { pod: { include: { pod_holder: true } } } },
            club: true,
            hr_zones: true,
          },
        });
      } catch (e: any) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          throw new BadRequestException('Jersey number already exists in this club');
        }
        throw e;
      }
    });
  }

  async assignPodToPlayer(
    clubAdminId: string,
    clubId: string,
    playerId: string,
    podId: string,
  ) {
    // validate admin
    const admin = await this.prisma.clubAdmin.findFirst({ where: { admin_id: clubAdminId, club_id: clubId } });
    if (!admin) throw new BadRequestException('Invalid club admin');

    // validate player
    const player = await this.prisma.player.findUnique({ where: { player_id: playerId } });
    if (!player || player.club_id !== clubId) throw new BadRequestException('Player not found');

    // validate pod
    const pod = await this.prisma.pod.findFirst({ where: { pod_id: podId }, include: { pod_holder: true } });
    if (!pod || !pod.pod_holder) throw new BadRequestException('Invalid pod');
    if (pod.pod_holder.club_id !== clubId) throw new BadRequestException('Pod does not belong to your club');

    // ensure pod not already assigned
    const existing = await this.prisma.playerPod.findFirst({ where: { pod_id: podId } });
    if (existing) throw new BadRequestException('Pod already assigned');

    await this.prisma.playerPod.create({ data: { player_id: playerId, pod_id: podId } });

    return this.prisma.player.findUnique({ where: { player_id: playerId }, include: { player_pods: { include: { pod: { include: { pod_holder: true } } } }, club: true, hr_zones: true } });
  }

  async unassignPodFromPlayer(
    clubAdminId: string,
    clubId: string,
    playerId: string,
  ) {
    // validate admin
    const admin = await this.prisma.clubAdmin.findFirst({ where: { admin_id: clubAdminId, club_id: clubId } });
    if (!admin) throw new BadRequestException('Invalid club admin');

    // validate player
    const player = await this.prisma.player.findUnique({ where: { player_id: playerId } });
    if (!player || player.club_id !== clubId) throw new BadRequestException('Player not found');

    // delete assignment(s)
    await this.prisma.playerPod.deleteMany({ where: { player_id: playerId } });

    return this.prisma.player.findUnique({ where: { player_id: playerId }, include: { player_pods: { include: { pod: { include: { pod_holder: true } } } }, club: true, hr_zones: true } });
  }

  async deletePlayer(
    clubAdminId: string,
    clubId: string,
    playerId: string,
  ) {
    // 1️⃣ Validate admin
    const admin = await this.prisma.clubAdmin.findFirst({
      where: { admin_id: clubAdminId, club_id: clubId }
    });
    if (!admin) throw new BadRequestException('Invalid club admin');

    // 2️⃣ Ensure player belongs to this club
    const player = await this.prisma.player.findUnique({
      where: { player_id: playerId }
    });

    if (!player || player.club_id !== clubId) {
      throw new BadRequestException('Player not found in your club');
    }

    // 3️⃣ Delete player
    await this.prisma.player.delete({
      where: { player_id: playerId }
    });

    return { success: true, message: 'Player deleted successfully' };
  }
}
