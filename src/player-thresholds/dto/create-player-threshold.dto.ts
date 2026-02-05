import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreatePlayerThresholdDto {
    @IsUUID()
    player_id: string;

    @IsString()
    type: string; // absolute or relative

    @IsString()
    zone_name: string; // Walk, Jog, Run, Sprint, High Intensity Sprint

    @IsNumber()
    min_val: number;

    @IsNumber()
    max_val: number;
}
