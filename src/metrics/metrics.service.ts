import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

async create(dto: any) {
  return this.prisma.activityMetric.create({
    data: {
      player_id: dto.player_id,
      total_distance: dto.total_distance,
      hsr_distance: dto.hsr_distance,
      sprint_distance: dto.sprint_distance,
      top_speed: dto.top_speed,
      sprint_count: dto.sprint_count,
      acceleration: dto.acceleration,
      deceleration: dto.deceleration,
      max_acceleration: dto.max_acceleration,
      max_deceleration: dto.max_deceleration,
      player_load: dto.player_load,
      power_score: dto.power_score,
      hr_max: dto.hr_max,
      time_in_red_zone: dto.time_in_red_zone,
      percent_in_red_zone: dto.percent_in_red_zone,
      hr_recovery_time: dto.hr_recovery_time,
      recorded_at: dto.recorded_at ? new Date(dto.recorded_at) : undefined,
    },
  });
}


  async findByPlayer(player_id: string) {
    return this.prisma.activityMetric.findMany({
      where: { player_id },
      orderBy: { recorded_at: 'desc' },
    });
  }
}
