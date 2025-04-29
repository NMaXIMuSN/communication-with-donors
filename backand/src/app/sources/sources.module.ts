import { Logger, Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { PrismaService } from '../prisma.service';
import { PrismaDonorService } from '../prismaDonor.service';

@Module({
  controllers: [SourcesController],
  providers: [SourcesService, PrismaService, PrismaDonorService, Logger],
})
export class SourcesModule {}
