import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly svc: ClubsService) {}

  /* ================= AVAILABLE CLUBS ================= */

  @UseGuards(JwtAuthGuard)
  @Get('available')
  async getAvailableClubs() {
    const clubs = await this.svc.findAvailable();
    return { data: clubs };
  }

  /* ================= CREATE CLUB ================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post()
  create(@Req() req: Request, @Body() dto: any) {
    const super_admin_id = (req as any).user.sub;
    return this.svc.create(super_admin_id, dto);
  }

  /* ================= GET ALL CLUBS ================= */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.svc.findAll();
  }

  /* ================= UNASSIGNED POD HOLDERS ================= */
    @UseGuards(JwtAuthGuard)
    @Get('unassigned-pod-holders')
    getUnassignedPodHolders() {
      return this.svc.findUnassignedPodHolders();
    }


  /* ================= UPDATE CLUB ================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  /* ================= UPDATE STATUS ================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'INACTIVE',
  ) {
    return this.svc.updateStatus(id, status);
  }

  /* ================= DELETE CLUB ================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.svc.delete(id);
  }



  /* ================= GET ONE CLUB ================= */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
