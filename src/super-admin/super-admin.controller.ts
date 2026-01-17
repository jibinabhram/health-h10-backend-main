import { Controller, Post, Body, Get, Param, Patch, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { localFileStorage } from '../common/utils/file-upload';
import { SuperAdminService } from './super-admin.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private svc: SuperAdminService) {}

  @Post()
  create(@Body() dto: CreateSuperAdminDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)  // uncomment if using auth
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateSuperAdminDto,
  ) {
    return this.svc.updateProfile(id, dto);
  }

  @Patch(':id/profile_image')
  @UseInterceptors(FileInterceptor('file', localFileStorage))
  // @UseGuards(JwtAuthGuard) // optional protection
  uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.svc.updateProfileImage(id, file.filename).then(() => ({
      message: 'Profile image updated',
      url: `/uploads/${file.filename}`,
    }));
  }

  @Get('dashboard/stats')
  async dashboardStats() {
    return this.svc.getDashboardStats();
  }

}
