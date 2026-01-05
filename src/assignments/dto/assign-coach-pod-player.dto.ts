import { IsString } from 'class-validator';

export class AssignCoachPodPlayerDto {
  @IsString()
  coach_id: string;

  @IsString()
  pod_id: string;

  @IsString()
  player_id: string;
}
