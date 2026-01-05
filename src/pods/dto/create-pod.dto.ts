import { IsOptional, IsString } from 'class-validator';

export class CreatePodDto {
  @IsOptional()
  @IsString()
  model?: string;
}
