import { Logger, Module } from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { SegmentsController } from './segments.controller';
import { PrismaService } from '../prisma.service';
import { PrismaDonorService } from '../prismaDonor.service';

@Module({
  controllers: [SegmentsController],
  providers: [SegmentsService, PrismaService, Logger, PrismaDonorService],
})
export class SegmentsModule {}
