import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PodLifecycleStatus } from '@prisma/client';

@Injectable()
export class PodsService {
  constructor(private prisma: PrismaService) {}

  /* ================= CREATE SINGLE POD ================= */
  async create(dto: { model?: string }) {

    const lastBatch = await this.prisma.pod.findFirst({
      where: { batch_id: { startsWith: 'BATCH_' } },
      orderBy: { batch_id: 'desc' },
      select: { batch_id: true },
    });

    const lastBatchNumber = lastBatch
      ? Number(lastBatch.batch_id.replace('BATCH_', ''))
      : 0;

    const batch_id = `BATCH_${String(lastBatchNumber + 1).padStart(6, '0')}`;


    const lastPod = await this.prisma.pod.findFirst({
      orderBy: { serial_number: 'desc' },
      select: { serial_number: true },
    });

    const lastNumber = lastPod?.serial_number
      ? Number(lastPod.serial_number.replace('PD', ''))
      : 0;

    return this.prisma.pod.create({
      data: {
        batch_id,
        serial_number: this.generateSerialNumber(lastNumber + 1),
        device_id: this.generateDeviceId(),
        model: dto.model ?? null,
        lifecycle_status: 'ACTIVE',
      },
    });
  }

  /* ================= CREATE MULTIPLE PODS ================= */
  async createMany(count: number, model?: string) {
    if (!count || count <= 0) {
      throw new BadRequestException('Count must be greater than 0');
    }

    const lastBatch = await this.prisma.pod.findFirst({
        where: { batch_id: { startsWith: 'BATCH_' } },
        orderBy: { batch_id: 'desc' },
        select: { batch_id: true },
      });

      const lastBatchNumber = lastBatch
        ? Number(lastBatch.batch_id.replace('BATCH_', ''))
        : 0;

      const batch_id = `BATCH_${String(lastBatchNumber + 1).padStart(6, '0')}`;


    const lastPod = await this.prisma.pod.findFirst({
      orderBy: { serial_number: 'desc' },
      select: { serial_number: true },
    });

    let lastNumber = lastPod?.serial_number
      ? Number(lastPod.serial_number.replace('PD', ''))
      : 0;

    const pods: Prisma.PodCreateManyInput[] = [];

    for (let i = 0; i < count; i++) {
      lastNumber++;
      pods.push({
        batch_id,
        serial_number: this.generateSerialNumber(lastNumber),
        device_id: this.generateDeviceId(),
        model: model ?? null,
        lifecycle_status: 'ACTIVE',
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
  async updateStatus(
    podId: string,
    status: PodLifecycleStatus,
  ) {
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
  private generateSerialNumber(num: number): string {
    return `PD${String(num).padStart(6, '0')}`;
  }

  private generateDeviceId(length = 16): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
}
