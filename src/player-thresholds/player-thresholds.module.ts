import { Module } from '@nestjs/common';
import { PlayerThresholdsService } from './player-thresholds.service';
import { PlayerThresholdsController } from './player-thresholds.controller';

@Module({
    controllers: [PlayerThresholdsController],
    providers: [PlayerThresholdsService],
})
export class PlayerThresholdsModule { }
