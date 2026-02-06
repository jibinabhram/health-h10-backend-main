import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { ActivityMetricsService } from './activity-metrics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activity-metrics')
export class ActivityMetricsController {
  constructor(
    private readonly service: ActivityMetricsService,
  ) { }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncMetrics(
    @Body() body: any,
    @Req() req: any,
  ) {
    const { session_id, player_id, metrics } = body;

    if (!session_id || !player_id || !metrics) {
      throw new BadRequestException('Invalid sync payload');
    }

    return this.service.createMetric(
      session_id,        // string
      player_id,         // ✅ FIXED: UUID string (NO Number())
      {
        deviceId: metrics.device_id,
        totalDistance: metrics.total_distance,
        hsrDistance: metrics.hsr_distance,
        sprintDistance: metrics.sprint_distance,
        topSpeed: metrics.top_speed,
        sprintCount: metrics.sprint_count,

        acceleration: metrics.acceleration,
        deceleration: metrics.deceleration,
        maxAcceleration: metrics.max_acceleration,
        maxDeceleration: metrics.max_deceleration,

        playerLoad: metrics.player_load,
        powerScore: metrics.power_score,

        hrMax: metrics.hr_max,
        timeInRedZone: metrics.time_in_red_zone,
        percentInRedZone: metrics.percent_in_red_zone,
        hrRecoveryTime: metrics.hr_recovery_time,

        recordedAt: metrics.recorded_at || metrics.created_at,
      },
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMetrics(@Req() req: any) {
    return this.service.getAllMetrics();
  }
}
