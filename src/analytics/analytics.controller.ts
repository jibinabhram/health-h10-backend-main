import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Get('player/:player_id/summary')
  playerSummary(@Param('player_id') player_id: string) {
    // ✅ UUID → pass as string (NO +player_id)
    return this.svc.playerSummary(player_id);
  }
}
