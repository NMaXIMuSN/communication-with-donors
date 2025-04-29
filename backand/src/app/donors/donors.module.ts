import { Module } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { DonorsController } from './donors.controller';
import { PrismaDonorService } from '../prismaDonor.service';

@Module({
  controllers: [DonorsController],
  providers: [DonorsService, PrismaDonorService],
})
export class DonorsModule {}
