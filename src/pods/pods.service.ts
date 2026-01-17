import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PodLifecycleStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class PodsService {
  constructor(private prisma: PrismaService) {}

  /* ================= CREATE SINGLE POD ================= */
  async create(dto: { model?: string; pod_holder_id: string }) {

    // 🔹 Generate next batch ID
    const lastBatch = await this.prisma.pod.findFirst({
      where: { batch_id: { startsWith: 'BATCH_' } },
      orderBy: { batch_id: 'desc' },
      select: { batch_id: true },
    });

    const lastBatchNumber = lastBatch
      ? Number(lastBatch.batch_id.replace('BATCH_', ''))
      : 0;

    const batch_id = `BATCH_${String(lastBatchNumber + 1).padStart(6, '0')}`;

    // ✅ Create pod with RANDOM serial & device id
    return this.prisma.pod.create({
      data: {
        batch_id,
        serial_number: this.generatePodSerialNumber(), // PD-XXXXXXXX
        device_id: this.generateDeviceId(5),            // A9K2Z
        lifecycle_status: 'ACTIVE',
        pod_holder_id: dto.pod_holder_id,
      },
    });
  }

  /* ================= CREATE MULTIPLE PODS ================= */
  async createMany(
    count: number,
    pod_holder_id: string,
    model?: string,
  ) {
    if (!count || count <= 0) {
      throw new BadRequestException('Count must be greater than 0');
    }

    // 🔹 Generate next batch ID
    const lastBatch = await this.prisma.pod.findFirst({
      where: { batch_id: { startsWith: 'BATCH_' } },
      orderBy: { batch_id: 'desc' },
      select: { batch_id: true },
    });

    const lastBatchNumber = lastBatch
      ? Number(lastBatch.batch_id.replace('BATCH_', ''))
      : 0;

    const batch_id = `BATCH_${String(lastBatchNumber + 1).padStart(6, '0')}`;

    // ✅ Create pods
    const pods: Prisma.PodCreateManyInput[] = [];

    for (let i = 0; i < count; i++) {
      pods.push({
        batch_id,
        serial_number: this.generatePodSerialNumber(),
        device_id: this.generateDeviceId(5),
        lifecycle_status: 'ACTIVE',
        pod_holder_id,
      });
    }

    await this.prisma.pod.createMany({ data: pods });

    return {
      batch_id,
      created: pods.length,
    };
  }

  /* ================= GET PODS ================= */
  async findAll() {
    return this.prisma.pod.findMany({
      orderBy: { created_at: 'asc' },
    });
  }

  async findByBatch(batch_id: string) {
    return this.prisma.pod.findMany({
      where: { batch_id },
      orderBy: { created_at: 'asc' },
    });
  }

  /* ================= UPDATE POD STATUS ================= */
  async updateStatus(podId: string, status: PodLifecycleStatus) {
    const pod = await this.prisma.pod.findUnique({
      where: { pod_id: podId },
    });

    if (!pod) {
      throw new BadRequestException('Pod not found');
    }

    return this.prisma.pod.update({
      where: { pod_id: podId },
      data: {
        lifecycle_status: status,
        updated_at: new Date(),
      },
    });
  }

  /* ================= HELPERS ================= */

  // PD-XXXXXXXX (same style as pod holder)
  private generatePodSerialNumber(): string {
    return `PD-${randomUUID()
      .replace(/-/g, '')
      .slice(0, 8)
      .toUpperCase()}`;
  }

  // 5-char device ID (A–Z, 0–9)
  private generateDeviceId(length = 5): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }
}
