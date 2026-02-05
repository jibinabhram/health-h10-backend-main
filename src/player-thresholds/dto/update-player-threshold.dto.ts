import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerThresholdDto } from './create-player-threshold.dto';

export class UpdatePlayerThresholdDto extends PartialType(CreatePlayerThresholdDto) { }
