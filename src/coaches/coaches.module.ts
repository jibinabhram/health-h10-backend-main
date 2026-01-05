import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';

@Module({
  imports: [PrismaModule],
  providers: [CoachesService],
  controllers: [CoachesController],
  exports: [CoachesService],
})
export class CoachesModule {}
