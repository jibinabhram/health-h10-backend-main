import { Injectable } from '@nestjs/common';
import { CreateExerciseTypeDto } from './dto/create-exercise-type.dto';
import { UpdateExerciseTypeDto } from './dto/update-exercise-type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExerciseTypesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createExerciseTypeDto: CreateExerciseTypeDto) {
    const { name, event_type, club_id } = createExerciseTypeDto;
    return this.prisma.exerciseType.create({
      data: {
        name,
        event_type: event_type || 'training',
        club_id,
        is_system: false,
      },
    });
  }

  findAll() {
    return `This action returns all exerciseTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseType`;
  }

  update(id: number, updateExerciseTypeDto: UpdateExerciseTypeDto) {
    return `This action updates a #${id} exerciseType`;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseType`;
  }
}
