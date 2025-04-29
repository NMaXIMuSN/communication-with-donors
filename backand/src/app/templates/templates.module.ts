import { Logger, Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService, PrismaService, Logger],
})
export class TemplatesModule {}
