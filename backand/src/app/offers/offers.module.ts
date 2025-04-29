import { Logger, Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { PrismaService } from '../prisma.service';
import { OffersWorker } from './offers.worker';
import { TelegramService } from '../telegram/telegram.service';
import { DonorsService } from '../donors/donors.service';
import { PrismaDonorService } from '../prismaDonor.service';
import { TemplatesService } from '../templates/templates.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [OffersController],
  providers: [
    OffersService,
    PrismaService,
    PrismaDonorService,
    OffersWorker,
    Logger,
    TelegramService,
    DonorsService,
    TemplatesService,
    MailService,
  ],
})
export class OffersModule {}
