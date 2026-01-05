import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.subscription.create({
      data: {
        club_id: dto.club_id,
        plan_id: dto.plan_id,
        start_date: dto.start_date ? new Date(dto.start_date) : undefined,
        end_date: dto.end_date ? new Date(dto.end_date) : undefined,
        status: dto.status || 'active',
      },
    });
  }

  async findAll() {
    return this.prisma.subscription.findMany();
  }
}
