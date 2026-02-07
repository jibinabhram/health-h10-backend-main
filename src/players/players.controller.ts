import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly svc: PlayersService) { }

  // CREATE PLAYER
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN')
  @Post()
  async create(
    @Req() req: any,
    @Body() dto: CreatePlayerDto,
  ) {
    return this.svc.createPlayer(
      req.user.sub,
      req.user.club_id,
      dto,
    );
  }

  // ✅ GET PLAYERS OF MY CLUB
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN')
  @Get()
  async findMyClubPlayers(@Req() req: any) {
    return this.svc.findPlayersByClub(req.user.club_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN')
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePlayerDto,
  ) {
    return this.svc.updatePlayer(req.user.sub, req.user.club_id, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN')
  @Post(':id/assign-pod')
  async assignPod(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { pod_id: string },
  ) {
    return this.svc.assignPodToPlayer(req.user.sub, req.user.club_id, id, body.pod_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN')
  @Post(':id/unassign-pod')
  async unassignPod(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.svc.unassignPodFromPlayer(req.user.sub, req.user.club_id, id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN')
  @Delete(':id')
  async delete(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.svc.deletePlayer(req.user.sub, req.user.club_id, id);
  }
}
