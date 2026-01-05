import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(dto: any) {
    return this.prisma.event.create({
      data: {
        club_id: dto.club_id,
        event_name: dto.event_name,
        event_date: dto.event_date ? new Date(dto.event_date) : undefined,
        location: dto.location,
        event_type: dto.event_type,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }
}
