import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';

@Injectable()
export class PaymentPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentPlanDto) {
    return await this.prisma.paymentPlan.create({
      data: dto,
    });
  }

  async findAll() {
    return await this.prisma.paymentPlan.findMany();
  }
}
