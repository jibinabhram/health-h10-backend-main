import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePodHolderDto {
  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @IsString()
  @IsNotEmpty()
  model: string;
}
