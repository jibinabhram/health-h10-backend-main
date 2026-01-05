import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMetricsDto {
  @IsString()
  player_id: string;

  @IsOptional()
  @IsNumber()
  total_distance?: number;

  @IsOptional()
  @IsNumber()
  top_speed?: number;

  @IsOptional()
  @IsNumber()
  player_load?: number;

  @IsOptional()
  @IsString()
  recorded_at?: string;
}
