import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.payment.create({
      data: {
        subscription_id: dto.subscription_id,
        amount_cents: dto.amount_cents,
        method: dto.method,
        transaction_ref: dto.transaction_ref,
      },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany();
  }
}
