import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TeamThresholdsService } from './team-thresholds.service';
import { CreateTeamThresholdDto } from './dto/create-team-threshold.dto';
import { UpdateTeamThresholdDto } from './dto/update-team-threshold.dto';

@Controller('team-thresholds')
export class TeamThresholdsController {
    constructor(private readonly teamThresholdsService: TeamThresholdsService) { }

    @Post()
    create(@Body() createTeamThresholdDto: CreateTeamThresholdDto) {
        console.log('🚀 [TeamThresholdsController] Create/Upsert request:', JSON.stringify(createTeamThresholdDto, null, 2));
        return this.teamThresholdsService.create(createTeamThresholdDto);
    }

    @Get()
    findAll(@Query('club_id') club_id?: string) {
        return this.teamThresholdsService.findAll(club_id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTeamThresholdDto: UpdateTeamThresholdDto) {
        return this.teamThresholdsService.update(id, updateTeamThresholdDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.teamThresholdsService.remove(id);
    }
}
