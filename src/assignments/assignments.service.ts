import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  assign(dto: any) {
    return this.prisma.coachAssignment.create({
      data: {
        coach_id: dto.coach_id,
        pod_id: dto.pod_id,
        player_id: dto.player_id,
      },
    });
  }

  findAll() {
    return this.prisma.coachAssignment.findMany();
  }
}
