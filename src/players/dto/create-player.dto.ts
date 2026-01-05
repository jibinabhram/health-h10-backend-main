import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  player_name: string;

  @IsOptional()
  @IsInt()
  jersey_number?: number;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  position?: string;

  @IsString()
  club_id: string;
}
