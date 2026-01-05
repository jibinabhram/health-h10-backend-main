import { Controller, Post, Get, Body } from '@nestjs/common';
import { PaymentPlansService } from './payment-plans.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';

@Controller('payment-plans')
export class PaymentPlansController {
  constructor(private readonly service: PaymentPlansService) {}

  @Post()
  async create(@Body() dto: CreatePaymentPlanDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }
}
