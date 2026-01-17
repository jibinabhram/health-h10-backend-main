import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * player_id is UUID → MUST be string
   */
  async playerSummary(player_id: string) {
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);

    const rows = await this.prisma.activityMetric.findMany({
      where: {
        playerId: player_id, // ✅ UUID string
        recordedAt: { gte: last7 },
      },
    });

    const total = rows.reduce(
      (sum, r) => sum + (r.totalDistance ?? 0),
      0,
    );

    return {
      player_id,
      total_distance_last7: total,
      samples: rows.length,
    };
  }
}
