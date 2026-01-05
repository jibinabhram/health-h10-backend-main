import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  create(dto: any) {
    return this.prisma.serviceRequest.create({
      data: {
        club_id: dto.club_id,
        requester_id: dto.requester_id,
        description: dto.description,
        status: dto.status || 'open',
      },
    });
  }

  findAll() {
    return this.prisma.serviceRequest.findMany();
  }
}
