import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PodsService } from './pods.service';
import { CreatePodDto } from './dto/create-pod.dto';

@Controller('pods')
export class PodsController {
  constructor(private readonly svc: PodsService) {}

  /* ================= CREATE SINGLE POD ================= */
  @Post()
  async create(@Body() dto: CreatePodDto) {
    const pod = await this.svc.create(dto);
    return { data: pod };
  }

  /* ================= CREATE PODS IN ONE BATCH ================= */
  @Post('batch')
  async createBatch(
    @Body() body: { count: number; pod_holder_id: string; model?: string },
  ) {
    if (!body.count || body.count <= 0) {
      throw new BadRequestException('count must be greater than 0');
    }

    const result = await this.svc.createMany(
      body.count,
      body.pod_holder_id,
      body.model,
    );

    return { data: result };
  }

  /* ================= GET ALL PODS ================= */
  @Get()
  async findAll() {
    const pods = await this.svc.findAll();
    return { data: pods };
  }

  /* ================= GET PODS BY BATCH ================= */
  @Get('by-batch')
  async findByBatch(@Query('batch_id') batch_id: string) {
    if (!batch_id) {
      throw new BadRequestException('batch_id is required');
    }

    const pods = await this.svc.findByBatch(batch_id);
    return { data: pods };
  }

  /* ================= UPDATE POD STATUS ================= */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'ACTIVE' | 'ASSIGNED' | 'MAINTENANCE' | 'DAMAGED' | 'LOST' },
  ) {
    if (!body.status) {
      throw new BadRequestException('status is required');
    }

    const pod = await this.svc.updateStatus(id, body.status);
    return { data: pod };
  }
}