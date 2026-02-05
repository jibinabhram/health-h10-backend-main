import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PlayerThresholdsService } from './player-thresholds.service';
import { CreatePlayerThresholdDto } from './dto/create-player-threshold.dto';
import { UpdatePlayerThresholdDto } from './dto/update-player-threshold.dto';

@Controller('player-thresholds')
export class PlayerThresholdsController {
    constructor(private readonly playerThresholdsService: PlayerThresholdsService) { }

    @Post()
    create(@Body() createPlayerThresholdDto: CreatePlayerThresholdDto) {
        return this.playerThresholdsService.create(createPlayerThresholdDto);
    }

    @Get()
    findAll(@Query('player_id') player_id?: string) {
        return this.playerThresholdsService.findAll(player_id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlayerThresholdDto: UpdatePlayerThresholdDto) {
        return this.playerThresholdsService.update(id, updatePlayerThresholdDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.playerThresholdsService.remove(id);
    }
}
