import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricsDto } from './dto/create-metrics.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private svc: MetricsService) {}

  @Post()
  create(@Body() dto: CreateMetricsDto) {
    return this.svc.create(dto);
  }

  @Get('player/:player_id')
  findByPlayer(@Param('player_id') player_id: string) {
    return this.svc.findByPlayer(player_id);
  }
}
