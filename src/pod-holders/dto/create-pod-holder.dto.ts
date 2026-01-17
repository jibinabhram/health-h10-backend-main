import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class CreatePodHolderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  podIds: string[];
}
