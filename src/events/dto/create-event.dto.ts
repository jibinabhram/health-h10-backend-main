import { IsString, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  event_name: string;

  @IsOptional()
  event_date?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  event_type?: string;

  @IsString()
  club_id: string;
}
