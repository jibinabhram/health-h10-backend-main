import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreatePodHolderDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  podIds: string[];
}
