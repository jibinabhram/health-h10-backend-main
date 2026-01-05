import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateClubAdminDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  club_id: string;
}
