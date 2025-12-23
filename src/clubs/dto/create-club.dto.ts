// src/clubs/dto/create-club.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateClubDto {
  // ───────── CLUB ─────────
  @IsString()
  @IsNotEmpty()
  club_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  sport: string;

  // ───────── ADMIN ─────────
  @IsString()
  @IsNotEmpty()
  admin_name: string;

  @IsEmail()
  admin_email: string;

  @IsOptional()
  @IsString()
  admin_phone?: string;

  @IsString()
  @MinLength(6)
  admin_password: string;

  // ───────── POD HOLDERS (MULTI) ─────────
  @IsOptional()
  @IsArray()                // ✅ REQUIRED
  @IsString({ each: true }) // ✅ REQUIRED
  pod_holder_ids?: string[];
}
