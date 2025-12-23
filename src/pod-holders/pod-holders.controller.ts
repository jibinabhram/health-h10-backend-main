import { Body, Controller, Delete, Get, Param, Post, Patch, Req, UseGuards } from '@nestjs/common';
import { PodHoldersService } from './pod-holders.service';
import { CreatePodHolderDto } from './dto/create-pod-holder.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pod-holders')
export class PodHoldersController {
  constructor(private readonly service: PodHoldersService) {}

  // ✅ CREATE POD HOLDER
  @Post()
  create(@Body() dto: CreatePodHolderDto) {
    console.log('BODY RECEIVED >>>', dto);
    return this.service.create(dto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/assign/:clubId')
  assign(
    @Param('id') podHolderId: string,
    @Param('clubId') clubId: string,
    @Req() req: any,
  ) {
    return this.service.assignPodHolderToClub(
      podHolderId,
      clubId,
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/unassign')
  unassign(
    @Param('id') podHolderId: string,
    @Req() req: any,
  ) {
    return this.service.unassignPodHolder(
      podHolderId,
      req.user.sub,
    );
  }
 //✅ GET ALL POD HOLDERS (ADMIN USE)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ ✅ ✅ GET ONLY AVAILABLE / UNASSIGNED POD HOLDERS
  @Get('available')
  findAvailable() {
    return this.service.findAvailable();
  }

  // ✅ GET ONE POD HOLDER
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ DELETE POD HOLDER
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
