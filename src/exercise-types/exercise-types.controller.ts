import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseTypesService } from './exercise-types.service';
import { CreateExerciseTypeDto } from './dto/create-exercise-type.dto';
import { UpdateExerciseTypeDto } from './dto/update-exercise-type.dto';

@Controller('exercise-types')
export class ExerciseTypesController {
  constructor(private readonly exerciseTypesService: ExerciseTypesService) {}

  @Post()
  create(@Body() createExerciseTypeDto: CreateExerciseTypeDto) {
    return this.exerciseTypesService.create(createExerciseTypeDto);
  }

  @Get()
  findAll() {
    return this.exerciseTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseTypeDto: UpdateExerciseTypeDto) {
    return this.exerciseTypesService.update(+id, updateExerciseTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseTypesService.remove(+id);
  }
}
