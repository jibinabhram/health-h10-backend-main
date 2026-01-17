import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePodHolderDto } from './dto/create-pod-holder.dto';
import {
  PodLifecycleStatus,
  PodReplacementReason,
} from '@prisma/client';

import { randomUUID } from 'crypto';

@Injectable()
export class PodHoldersService {
  constructor(private prisma: PrismaService) {}

  /* ================= CREATE POD HOLDER ================= */

  async create(dto: CreatePodHolderDto) {
    // Model validation
    if (!dto.model || !dto.model.trim()) {
      throw new BadRequestException('Pod holder model is required');
    }

    // ✅ FLEXIBLE RULE (minimum 1 pod)
    if (!dto.podIds || dto.podIds.length < 1) {
      throw new BadRequestException(
        'Pod holder must have at least 1 pod',
      );
    }

    return this.prisma.$transaction(async tx => {
      const serialNumber = `PH-${randomUUID()
        .slice(0, 8)
        .toUpperCase()}`;

      const podHolder = await tx.podHolder.create({
        data: {
          model: dto.model.trim(),
          serial_number: serialNumber,
        },
      });

      const updated = await tx.pod.updateMany({
        where: {
          pod_id: { in: dto.podIds },
          pod_holder_id: null,
          lifecycle_status: {
            in: [
              PodLifecycleStatus.ACTIVE,
              PodLifecycleStatus.MAINTENANCE,
            ],
          },
        },
        data: {
          pod_holder_id: podHolder.pod_holder_id,
          lifecycle_status: PodLifecycleStatus.ASSIGNED,
        },
      });

      if (updated.count !== dto.podIds.length) {
        throw new BadRequestException(
          'Some pods are already assigned or invalid',
        );
      }

      return podHolder;
    });
  }


  /* ================= GET ALL POD HOLDERS ================= */

  findAll() {
    return this.prisma.podHolder.findMany({
      include: {
        pods: {
          select: {
            pod_id: true,
            serial_number: true,
            lifecycle_status: true,
          },
        },
        club: {
          select: { club_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /* ================= GET AVAILABLE PODS ================= */

  findAvailablePods() {
    return this.prisma.pod.findMany({
      where: {
        pod_holder_id: null,
        lifecycle_status: {
          in: [
            PodLifecycleStatus.ACTIVE,
            PodLifecycleStatus.MAINTENANCE,
          ],
        },
      },
      select: {
        pod_id: true,
        serial_number: true,
        lifecycle_status: true,
      },
      orderBy: { serial_number: 'asc' },
    });
  }

  /* ================= GET UNASSIGNED & USABLE POD HOLDERS ================= */

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



  /* ================= GET ONE ================= */

  async findOne(id: string) {
    const podHolder = await this.prisma.podHolder.findUnique({
      where: { pod_holder_id: id },
      include: {
        pods: true,
        club: { select: { club_name: true } },
      },
    });

    if (!podHolder) {
      throw new NotFoundException('Pod holder not found');
    }

    return podHolder;
  }


  /* ================= ADD POD (EMPTY SLOT) ================= */

  async addPodToHolder(podHolderId: string, podId: string) {
    const holder = await this.prisma.podHolder.findUnique({
      where: { pod_holder_id: podHolderId },
      include: { pods: true },
    });

    if (!holder) {
      throw new NotFoundException('Pod holder not found');
    }



    const pod = await this.prisma.pod.findUnique({
      where: { pod_id: podId },
    });

    if (!pod) {
      throw new NotFoundException('Pod not found');
    }

    if (pod.pod_holder_id) {
      throw new BadRequestException('Pod already assigned');
    }

    if (
      pod.lifecycle_status !== PodLifecycleStatus.ACTIVE &&
      pod.lifecycle_status !== PodLifecycleStatus.MAINTENANCE
    ) {
      throw new BadRequestException('Pod is not eligible for assignment');
    }

    await this.prisma.pod.update({
      where: { pod_id: podId },
      data: {
        pod_holder_id: podHolderId,
        lifecycle_status: PodLifecycleStatus.ASSIGNED,
      },
    });

    return { message: 'Pod added successfully' };
  }


  /* ================= UPDATE POD HOLDER STATUS ================= */

  async updateStatus(
    podHolderId: string,
    status: PodLifecycleStatus,
  ) {
    const holder = await this.prisma.podHolder.findUnique({
      where: { pod_holder_id: podHolderId },
    });

    if (!holder) {
      throw new NotFoundException('Pod holder not found');
    }

    await this.prisma.$transaction(async tx => {
      if (status === 'ACTIVE') {
        //  UNASSIGN PODS COMPLETELY
        await tx.pod.updateMany({
          where: { pod_holder_id: podHolderId },
          data: {
            pod_holder_id: null,
            lifecycle_status: 'ACTIVE',
          },
        });
      } else {
        await tx.pod.updateMany({
          where: { pod_holder_id: podHolderId },
          data: { lifecycle_status: status },
        });
      }

      await tx.podHolderStatus.create({
        data: {
          pod_holder_id: podHolderId,
          working_status: status,
        },
      });
    });

    return { message: 'Status updated successfully' };
  }

  /* ================= REPLACE POD ================= */

  async replacePod(params: {
    podHolderId: string;
    oldPodId: string;
    newPodId: string;
    performedBy?: string;
  }) {
    const { podHolderId, oldPodId, newPodId, performedBy } = params;

    return this.prisma.$transaction([
      this.prisma.pod.update({
        where: { pod_id: oldPodId },
        data: {
          pod_holder_id: null,
          lifecycle_status: PodLifecycleStatus.ACTIVE,
        },
      }),
      this.prisma.pod.update({
        where: { pod_id: newPodId },
        data: {
          pod_holder_id: podHolderId,
          lifecycle_status: PodLifecycleStatus.ASSIGNED,
        },
      }),
      this.prisma.podReplacementAudit.create({
        data: {
          pod_holder_id: podHolderId,
          old_pod_id: oldPodId,
          new_pod_id: newPodId,
          reason: PodReplacementReason.UPGRADE,
          performed_by: performedBy ?? 'SYSTEM',
        },
      }),
    ]);
  }


   /* ================= REMOVE POD ================= */


    async removePodFromHolder(podHolderId: string, podId: string) {
      const pod = await this.prisma.pod.findUnique({
        where: { pod_id: podId },
      });

      if (!pod || pod.pod_holder_id !== podHolderId) {
        throw new NotFoundException('Pod not found in this holder');
      }

      await this.prisma.pod.update({
        where: { pod_id: podId },
        data: {
          pod_holder_id: null,
          lifecycle_status: PodLifecycleStatus.ACTIVE,
        },
      });

      return { message: 'Pod removed successfully' };
    }
  /* ================= DELETE POD HOLDER ================= */

  async remove(id: string) {
    await this.prisma.$transaction([
      this.prisma.pod.updateMany({
        where: { pod_holder_id: id },
        data: {
          pod_holder_id: null,
          lifecycle_status: 'ACTIVE',
        },
      }),
      this.prisma.podHolder.delete({
        where: { pod_holder_id: id },
      }),
    ]);

    return { message: 'Pod holder deleted successfully' };
  }

  /* ================= ASSIGN TO CLUB ================= */

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

    return { message: 'Pod holder assigned to club' };
  }

  /* ================= UNASSIGN FROM CLUB ================= */

  async unassignPodHolder(
    podHolderId: string,
    performedBy: string,
  ) {
    const podHolder = await this.prisma.podHolder.findUnique({
      where: { pod_holder_id: podHolderId },
    });

    if (!podHolder?.club_id) {
      throw new BadRequestException('Pod holder not assigned');
    }

    await this.prisma.$transaction([
      this.prisma.pod.updateMany({
        where: { pod_holder_id: podHolderId },
        data: {
          pod_holder_id: null,
          lifecycle_status: 'ACTIVE',
        },
      }),
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

    return { message: 'Pod holder unassigned' };
  }
}
