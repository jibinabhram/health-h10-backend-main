import { Injectable } from '@nestjs/common';
import { CreateExerciseTypeDto } from './dto/create-exercise-type.dto';
import { UpdateExerciseTypeDto } from './dto/update-exercise-type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExerciseTypesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createExerciseTypeDto: CreateExerciseTypeDto) {
    const { name, event_type, club_id } = createExerciseTypeDto;

    // Check if it already exists to prevent duplicates
    const existing = await this.prisma.exerciseType.findFirst({
      where: {
        club_id,
        name,
      },
      include: {
        club: {
          select: {
            club_id: true,
            club_name: true,
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.exerciseType.create({
      data: {
        name,
        event_type: event_type || 'training',
        club_id,
        is_system: false,
      },
      include: {
        club: {
          select: {
            club_id: true,
            club_name: true,
          },
        },
      },
    });
  }

  async findAll(club_id?: string) {
    return this.prisma.exerciseType.findMany({
      where: club_id ? { club_id } : undefined,
      orderBy: { created_at: 'desc' },
      include: {
        club: {
          select: {
            club_id: true,
            club_name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.exerciseType.findUnique({
      where: { exercise_type_id: id },
      include: {
        club: {
          select: {
            club_id: true,
            club_name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateExerciseTypeDto: UpdateExerciseTypeDto) {
    const { name, event_type } = updateExerciseTypeDto;
    return this.prisma.exerciseType.update({
      where: { exercise_type_id: id },
      data: {
        ...(name && { name }),
        ...(event_type && { event_type }),
      },
      include: {
        club: {
          select: {
            club_id: true,
            club_name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.exerciseType.delete({
      where: { exercise_type_id: id },
    });
  }
}
