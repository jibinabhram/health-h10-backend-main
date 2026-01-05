import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  create(dto: any) {
    return this.prisma.player.create({
      data: {
        player_name: dto.player_name,
        jersey_number: dto.jersey_number,
        age: dto.age,
        position: dto.position,
        phone: dto.phone,
        club_id: dto.club_id,
      },
    });
  }

  findAll() {
    return this.prisma.player.findMany();
  }
}
