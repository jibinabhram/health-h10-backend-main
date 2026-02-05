import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamThresholdDto } from './dto/create-team-threshold.dto';
import { UpdateTeamThresholdDto } from './dto/update-team-threshold.dto';

@Injectable()
export class TeamThresholdsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createTeamThresholdDto: CreateTeamThresholdDto) {
        const { club_id, type, zone_name, min_val, max_val, is_default } = createTeamThresholdDto;
        return this.prisma.teamThreshold.upsert({
            where: {
                club_id_type_zone_name: {
                    club_id,
                    type,
                    zone_name,
                },
            },
            update: {
                min_val,
                max_val,
                is_default: is_default ?? false,
            },
            create: {
                club_id,
                type,
                zone_name,
                min_val,
                max_val,
                is_default: is_default ?? false,
            },
        });
    }

    async findAll(club_id?: string) {
        return this.prisma.teamThreshold.findMany({
            where: club_id ? { club_id } : undefined,
            orderBy: [
                { type: 'asc' },
                { min_val: 'asc' },
            ],
        });
    }

    async update(id: string, updateTeamThresholdDto: UpdateTeamThresholdDto) {
        return this.prisma.teamThreshold.update({
            where: { threshold_id: id },
            data: updateTeamThresholdDto,
        });
    }

    async remove(id: string) {
        return this.prisma.teamThreshold.delete({
            where: { threshold_id: id },
        });
    }
}
