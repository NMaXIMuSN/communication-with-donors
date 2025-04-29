import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { $Enums, Offers, Prisma } from '@prisma/client';
import { BadRequestException } from '../errors';

@Injectable()
export class OffersService {
  constructor(
    private prismaService: PrismaService,
    private logger: Logger,
  ) {}
  async createOffers(campaignId: number) {
    const campaign = await this.prismaService.campaign.findUnique({
      where: {
        id: campaignId,
      },
      include: {
        campaignChannels: {
          include: {
            creatives: {
              where: {
                status: 'ACTIVE',
              },
              include: {
                template: {
                  include: {
                    settings: true,
                  },
                },
              },
            },
          },
          where: {
            creatives: {
              some: {
                status: 'ACTIVE',
              },
            },
          },
        },
        segment: {
          include: {
            source: true,
          },
        },
      },
    });

    if (!campaign) {
      return;
    }

    const donors = await this.prismaService.segmentUser.findMany({
      where: {
        segmentId: campaign.segmentId,
      },
    });

    const offers: Prisma.OffersCreateManyInput[] = [];
    campaign.campaignChannels.forEach((channel) => {
      channel.creatives.forEach((creative) => {
        const setting = creative.template.settings.find(
          ({ lang }) => lang === creative.lang,
        );

        if (setting) {
          donors.forEach(({ donorId }) => {
            offers.push({
              settingId: setting?.id,
              channelType: channel.type,
              donorId,
              campaignId: campaign.id,
              finishAt: campaign.endAt,
              startAt: campaign.startAt,
              includeTables: campaign.segment.source.map(
                ({ tableName }) =>
                  tableName[0].toLocaleLowerCase() + tableName.slice(1),
              ),
            });
          });
        }
      });
    });
    return await this.prismaService.offers.createMany({
      data: offers,
    });
  }

  async getOffersStatus(campaignId: number) {
    try {
      return await this.prismaService.offersLog.findMany({
        where: {
          campaignId,
        },
      });
    } catch {
      throw new BadRequestException('Не удалось собрать логи');
    }
  }

  async saveSuccessLog(offer: Offers) {
    try {
      await this.prismaService.offersLog.create({
        data: {
          channelType: offer.channelType,
          donorId: offer.donorId,
          status: $Enums.StatusOffersLog.SUCCESS,
          campaignId: offer.campaignId,
          settingId: offer.settingId,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async saveErrorLog(offer: Offers, message: string) {
    try {
      await this.prismaService.offersLog.create({
        data: {
          channelType: offer.channelType,
          donorId: offer.donorId,
          status: $Enums.StatusOffersLog.ERROR,
          campaignId: offer.campaignId,
          settingId: offer.settingId,
          message,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async deleteOffers(campaignId: number) {
    await this.prismaService.offers.deleteMany({
      where: {
        campaignId: campaignId,
      },
    });
  }
}
