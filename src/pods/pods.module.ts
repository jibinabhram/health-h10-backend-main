import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PodsService } from './pods.service';
import { PodsController } from './pods.controller';

@Module({
  imports: [PrismaModule],
  providers: [PodsService],
  controllers: [PodsController],
})
export class PodsModule {}
