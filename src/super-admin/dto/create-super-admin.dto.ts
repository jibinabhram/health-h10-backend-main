import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateSuperAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;
}
