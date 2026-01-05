import { IsOptional, IsString } from 'class-validator';

export class CreateServiceRequestDto {
  @IsOptional()
  @IsString()
  club_id?: string;

  @IsOptional()
  @IsString()
  requester_id?: string;

  @IsString()
  description: string;
}
