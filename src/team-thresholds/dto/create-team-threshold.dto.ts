import { IsString, IsNumber, IsBoolean, IsUUID, IsIn, IsOptional } from 'class-validator';

export class CreateTeamThresholdDto {
    @IsUUID()
    club_id: string;

    @IsString()
    @IsIn(['absolute', 'relative'])
    type: string;

    @IsString()
    zone_name: string;

    @IsNumber()
    min_val: number;

    @IsNumber()
    max_val: number;

    @IsBoolean()
    @IsOptional()
    is_default?: boolean;
}
