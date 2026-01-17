import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PodHoldersService } from './pod-holders.service';
import { CreatePodHolderDto } from './dto/create-pod-holder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PodLifecycleStatus } from '@prisma/client';

@Controller('pod-holders')
export class PodHoldersController {
  constructor(private readonly service: PodHoldersService) {}

  /* ================= CREATE ================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post()
  create(@Body() dto: CreatePodHolderDto) {
    return this.service.create(dto);
  }

  /* ================= AVAILABLE PODS (🔥 MUST BE BEFORE :id) ================= */
  @UseGuards(JwtAuthGuard)
  @Get('available')
  findAvailablePods() {
    return this.service.findAvailablePods();
  }

  /* ================= UNASSIGNED POD HOLDERS ================= */
  @UseGuards(JwtAuthGuard)
  @Get('unassigned')
  findUnassignedPodHolders() {
    return this.service.findUnassignedPodHolders();
  }

  /* ================= GET ALL ================= */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /* ================= GET ONE (⚠️ ALWAYS LAST) ================= */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /* ================= UPDATE STATUS ================= */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PodLifecycleStatus,
  ) {
    return this.service.updateStatus(id, status);
  }

  /* ================= ADD POD ================= */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/add-pod/:podId')
  addPod(
    @Param('id') podHolderId: string,
    @Param('podId') podId: string,
  ) {
    return this.service.addPodToHolder(podHolderId, podId);
  }

  /* ================= REPLACE POD ================= */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/replace-pod')
  replacePod(
    @Param('id') podHolderId: string,
    @Body()
    body: {
      oldPodId: string;
      newPodId: string;
      performedBy?: string;
    },
  ) {
    return this.service.replacePod({
      podHolderId,
      ...body,
    });
  }

  /* ================= REMOVE POD ================= */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/remove-pod/:podId')
  removePod(
    @Param('id') podHolderId: string,
    @Param('podId') podId: string,
  ) {
    return this.service.removePodFromHolder(podHolderId, podId);
  }

  /* ================= ASSIGN TO CLUB ================= */
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

  /* ================= UNASSIGN FROM CLUB ================= */
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

  /* ================= DELETE ================= */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
