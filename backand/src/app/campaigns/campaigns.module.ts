import { Logger, Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { PrismaService } from '../prisma.service';
import { OffersService } from '../offers/offers.service';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, PrismaService, OffersService, Logger],
})
export class CampaignsModule {}
