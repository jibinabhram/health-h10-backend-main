import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePodDto {
  @IsOptional()
  @IsString()
  model?: string;


  @IsUUID()
  pod_holder_id: string;
}
