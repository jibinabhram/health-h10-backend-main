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

  // profile_image is usually updated via file upload,
  // but you can keep this if you want to set a URL manually.
  @IsOptional()
  @IsString()
  profile_image?: string;
}
