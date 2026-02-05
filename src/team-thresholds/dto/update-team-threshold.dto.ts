import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamThresholdDto } from './create-team-threshold.dto';

export class UpdateTeamThresholdDto extends PartialType(CreateTeamThresholdDto) { }
