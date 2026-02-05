import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateExerciseTypeDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    event_type?: string;

    @IsUUID()
    club_id: string;
}
