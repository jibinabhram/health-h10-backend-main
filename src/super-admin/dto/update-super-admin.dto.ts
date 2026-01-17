import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateSuperAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;


  @IsOptional()
  @IsString()
  profile_image?: string;
}
