import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class AllocatePodDto {
  @IsNotEmpty()
  @IsString()
  pod_id: string;

  @IsOptional()
  @IsString()
  coach_id?: string;

  @IsOptional()
  @IsInt()
  battery_level?: number;

  @IsOptional()
  @IsString()
  health_status?: string;
}
