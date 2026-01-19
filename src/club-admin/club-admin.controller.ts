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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { ClubAdminService } from './club-admin.service';
import { CreateClubAdminDto } from './dto/create-club-admin.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { localFileStorage } from '../common/utils/file-upload';
import { UpdateClubAdminDto } from './dto/update-club-admin.dto';

@Controller('club-admin')
export class ClubAdminController {
  constructor(private readonly svc: ClubAdminService) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post()
  create(@Body() dto: CreateClubAdminDto) {
    return this.svc.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {
    return this.svc.findAll();
  }


  @Patch('by-club/:clubId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  updateByClub(
    @Param('clubId') clubId: string,
    @Body() dto: any,
  ) {
    return this.svc.updateByClubId(clubId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateClubAdminDto,
  ) {
    return this.svc.updateProfile(id, dto);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file', localFileStorage))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN', 'SUPER_ADMIN')
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('FILE:', file);
    console.log('ADMIN ID:', id);
    return this.svc.updateProfileImage(id, file.filename);
}
}