import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClubAdminService } from './club-admin.service';
import { ClubAdminController } from './club-admin.controller';

@Module({
  imports: [PrismaModule],
  providers: [ClubAdminService],
  controllers: [ClubAdminController],
  exports: [ClubAdminService],
})
export class ClubAdminModule {}
