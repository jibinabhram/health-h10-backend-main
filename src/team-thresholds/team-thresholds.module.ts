import { Module } from '@nestjs/common';
import { TeamThresholdsService } from './team-thresholds.service';
import { TeamThresholdsController } from './team-thresholds.controller';

@Module({
    controllers: [TeamThresholdsController],
    providers: [TeamThresholdsService],
})
export class TeamThresholdsModule { }
