import { Module } from '@nestjs/common';
import { ExerciseTypesService } from './exercise-types.service';
import { ExerciseTypesController } from './exercise-types.controller';

@Module({
  controllers: [ExerciseTypesController],
  providers: [ExerciseTypesService],
})
export class ExerciseTypesModule {}
