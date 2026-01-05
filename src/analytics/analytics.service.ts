import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async playerSummary(player_id: string) {
    // simple analytics example: last 7 days total distance
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);
    const rows = await this.prisma.activityMetric.findMany({
      where: { player_id, recorded_at: { gte: last7 } },
    });
    const total = rows.reduce((s, r) => s + (r.total_distance || 0), 0);
    return { player_id, total_distance_last7: total, samples: rows.length };
  }
}
