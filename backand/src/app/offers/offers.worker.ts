import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { DonorsService } from '../donors/donors.service';
import { TemplatesService } from '../templates/templates.service';
import { $Enums } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { OffersService } from './offers.service';

@Injectable()
export class OffersWorker {
  constructor(
    private readonly prisma: PrismaService,
    private readonly offersService: OffersService,
    private readonly telegram: TelegramService,
    private readonly donorsService: DonorsService,
    private readonly templateService: TemplatesService,
    private readonly mailService: MailService,
    private readonly logger: Logger,
  ) {}

  BATCH_SIZE = 30; // количество оферов для обработки в одном пакете

  @Cron('*/30 * * * * *')
  async handleCron() {
    this.logger.log('Executing scheduled job for sending campaigns');

    let offset = 0;

    // Пагинация для обработки большого количества данных
    while (true) {
      const offers = await this.prisma.offers.findMany({
        where: {
          startAt: {
            lt: new Date(Date.now()),
          },
        },
        include: {
          setting: true,
        },
        skip: offset,
        take: this.BATCH_SIZE,
      });

      if (offers.length === 0) {
        break; // выход из цикла, если больше нет оферов
      }

      const donorsMap = new Map<number, (typeof offers)[0][]>();
      offers.forEach((offer) => {
        donorsMap.set(offer.donorId, [
          ...(donorsMap.get(offer.donorId) ?? []),
          offer,
        ]);
      });

      // Создаем массив промисов, который будут выполняться с ограничением
      const taskPromises = Array.from(donorsMap.values()).map(
        async (offersBatch) => {
          // Пакетное ограничение обработки для API Telegram
          const index = Math.floor(Math.random() * offersBatch.length);
          const offer = offersBatch[index];

          if (!offer) return;

          const donorInfo = await this.donorsService.getDonorInfoWithInclude(
            offer.donorId,
            offer.includeTables,
          );

          try {
            switch (offer.channelType) {
              case $Enums.ChannelType.TELEGRAM:
                if (!donorInfo?.telegram) {
                  throw new Error('Отсутствует chatId для коммуникации');
                }

                await this.telegram.sendMessage(
                  donorInfo.telegram,
                  this.templateService.fillText(offer.setting.content, {
                    offer,
                    donorInfo,
                  }),
                );
                break;

              case $Enums.ChannelType.EMAIL:
                if (!donorInfo?.email) {
                  throw new Error('Отсутствует email для коммуникации');
                }
                await this.mailService.sendCampaignEmail(
                  donorInfo.email,
                  this.templateService.fillText(offer.setting.content, {
                    offer,
                    donorInfo,
                  }),
                );
                break;
            }

            await this.offersService.saveSuccessLog(offer);
          } catch (error) {
            this.logger.error(
              `Failed to send message for offer ${offer.id}`,
              JSON.stringify(error),
            );
            await this.offersService.saveErrorLog(offer, JSON.stringify(error));
          } finally {
            await this.prisma.offers.delete({
              where: {
                id: offer.id,
              },
            });
          }
        },
      );

      // Ограничение одновременно выполняемых заданий (например, до 10)
      await Promise.allSettled(taskPromises);

      offset += this.BATCH_SIZE; // Переход к следующему пакету

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 секунда задержки
    }
  }

  @Cron('*/30 * * * * *')
  async deleteOffers() {
    await this.prisma.offers.deleteMany({
      where: {
        finishAt: {
          lt: new Date(Date.now()),
        },
      },
    });
  }
}
