import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePodHolderDto } from './dto/create-pod-holder.dto';

@Injectable()
export class PodHoldersService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE POD HOLDER
  create(data: CreatePodHolderDto) {
    return this.prisma.podHolder.create({
      data,
    });
  }

  // ✅ GET ALL POD HOLDERS
  findAll() {
    return this.prisma.podHolder.findMany();
  }

  // ✅ ✅ ✅ GET ONLY UNASSIGNED POD HOLDERS
  findAvailable() {
    return this.prisma.podHolder.findMany({
      where: {
        club_id: null,
      },
    });
  }

  // ✅ GET SINGLE POD HOLDER
  async findOne(id: string) {
    const pod = await this.prisma.podHolder.findUnique({
      where: { pod_holder_id: id },
    });

    if (!pod) {
      throw new NotFoundException('Pod holder not found');
    }

    return pod;
  }

  // ✅ DELETE POD HOLDER
  async remove(id: string) {
    await this.prisma.podHolder.delete({
      where: { pod_holder_id: id },
    });

    return { message: 'Pod holder deleted successfully' };
  }
  async assignPodHolderToClub(
    podHolderId: string,
    clubId: string,
    performedBy: string,
  ) {
    const podHolder = await this.prisma.podHolder.findUnique({
      where: { pod_holder_id: podHolderId },
    });

    if (!podHolder) {
      throw new BadRequestException('Pod holder not found');
    }

    // ❌ already assigned to another club
    if (podHolder.club_id && podHolder.club_id !== clubId) {
      throw new BadRequestException(
        'Pod holder already assigned to another club',
      );
    }

    const club = await this.prisma.club.findUnique({
      where: { club_id: clubId },
    });

    if (!club) {
      throw new BadRequestException('Club not found');
    }

    await this.prisma.$transaction([
      this.prisma.podHolder.update({
        where: { pod_holder_id: podHolderId },
        data: { club_id: clubId },
      }),

      this.prisma.podHolderAudit.create({
        data: {
          pod_holder_id: podHolderId,
          from_club_id: podHolder.club_id,
          to_club_id: clubId,
          action: podHolder.club_id ? 'REASSIGNED' : 'ASSIGNED',
          performed_by: performedBy,
        },
      }),
    ]);
  }
  async unassignPodHolder(
    podHolderId: string,
    performedBy: string,
  ) {
    const podHolder = await this.prisma.podHolder.findUnique({
      where: { pod_holder_id: podHolderId },
    });

    if (!podHolder?.club_id) return;

    await this.prisma.$transaction([
      this.prisma.podHolder.update({
        where: { pod_holder_id: podHolderId },
        data: { club_id: null },
      }),

      this.prisma.podHolderAudit.create({
        data: {
          pod_holder_id: podHolderId,
          from_club_id: podHolder.club_id,
          to_club_id: null,
          action: 'UNASSIGNED',
          performed_by: performedBy,
        },
      }),
    ]);
  }
}
