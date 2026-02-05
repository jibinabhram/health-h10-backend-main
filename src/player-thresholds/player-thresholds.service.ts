import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerThresholdDto } from './dto/create-player-threshold.dto';
import { UpdatePlayerThresholdDto } from './dto/update-player-threshold.dto';

@Injectable()
export class PlayerThresholdsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPlayerThresholdDto: CreatePlayerThresholdDto) {
        const { player_id, type, zone_name, min_val, max_val } = createPlayerThresholdDto;
        return this.prisma.playerThreshold.upsert({
            where: {
                player_id_type_zone_name: {
                    player_id,
                    type,
                    zone_name,
                },
            },
            update: {
                min_val,
                max_val,
            },
            create: {
                player_id,
                type,
                zone_name,
                min_val,
                max_val,
            },
        });
    }

    async findAll(player_id?: string) {
        return this.prisma.playerThreshold.findMany({
            where: player_id ? { player_id } : undefined,
            orderBy: [
                { type: 'asc' },
                { min_val: 'asc' },
            ],
        });
    }

    async update(id: string, updatePlayerThresholdDto: UpdatePlayerThresholdDto) {
        return this.prisma.playerThreshold.update({
            where: { threshold_id: id },
            data: updatePlayerThresholdDto,
        });
    }

    async remove(id: string) {
        return this.prisma.playerThreshold.delete({
            where: { threshold_id: id },
        });
    }
}
