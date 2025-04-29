import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICampaignCreate } from './type';
import { NotFoundException, UnknownErrorException } from '../errors';
import { $Enums, Campaign, Prisma } from '@prisma/client';
import { AddCreativeDto } from './dto/creative.dto';
import { OffersService } from '../offers/offers.service';
import { ISearchVariables } from '../type';

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
    private offersService: OffersService,
    private logger: Logger,
  ) {}
  async create(campaign: ICampaignCreate, uid: number) {
    try {
      return await this.prisma.campaign.create({
        data: {
          endAt: campaign.endAt,
          name: campaign.name,
          startAt: campaign.startAt,
          description: campaign.description,
          segment: {
            connect: {
              id: campaign.segmentId,
            },
          },
          createdBy: {
            connect: { id: uid },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async search({
    filter,
    limit,
    offset,
    search,
    sort,
  }: ISearchVariables<
    Campaign,
    {
      channels: $Enums.ChannelType[];
    }
  >) {
    const where: Prisma.CampaignWhereInput | undefined =
      search || filter
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
                campaignChannels: {
                  some: {
                    type: {
                      in: filter?.channels,
                    },
                  },
                },
              },
              {
                id: {
                  equals: isNaN(Number(search)) ? undefined : Number(search),
                },
              },
            ],
          }
        : undefined;

    try {
      const [results, total] = await Promise.all([
        this.prisma.campaign.findMany({
          where,
          skip: offset,
          take: limit,
          include: {
            campaignChannels: true,
          },
          orderBy: sort,
        }),
        this.prisma.campaign.count({
          where,
        }),
      ]);
      return {
        data: results,
        page: {
          total,
          offset: offset,
          lastPage: Math.ceil(total / (limit || 0)),
        },
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      return {
        data: [],
        page: {
          total: 1,
          offset: 0,
          lastPage: 0,
        },
      };
    }
  }

  findAll() {
    return `This action returns all campaigns`;
  }

  async findOne(id: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id,
      },
      include: {
        segment: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Кампания не найдена');
    }

    return campaign;
  }

  async getChannels(id: number) {
    return await this.prisma.channels.findMany({
      where: {
        campaign: {
          id,
        },
      },
      include: {
        creatives: {
          include: {
            template: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }

  async createChannels(id: number, type: $Enums.ChannelType) {
    return await this.prisma.channels.create({
      data: {
        type: type,
        campaign: {
          connect: {
            id,
          },
        },
      },
      include: {
        creatives: {
          include: {
            template: true,
          },
        },
      },
    });
  }

  async update(id: number, newData: any) {
    const campaign = this.prisma.campaign.update({
      where: {
        id,
      },
      data: {
        language: newData.language,
        segmentId: newData.segmentId,
        name: newData.name,
        description: newData.description,
      },
    });
    return campaign;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }

  async updateStatus(id: number, status: $Enums.CampaignStatus) {
    if (status === $Enums.CampaignStatus.ACTIVE) {
      await this.offersService.createOffers(id);
    }

    if (status === $Enums.CampaignStatus.DEACTIVATED) {
      await this.offersService.deleteOffers(id);
    }

    const campaign = await this.prisma.campaign.update({
      data: {
        status,
      },
      where: {
        id,
      },
    });
    return campaign.status;
  }

  async getStatus(id) {
    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    return {
      status: campaign?.status || $Enums.CampaignStatus.DEACTIVATED,
    };
  }

  async deleteChannel(campaignId: number, channelId: number) {
    try {
      return await this.prisma.channels.delete({
        where: {
          id: channelId,
          campaignId: campaignId,
        },
        include: {
          creatives: true,
        },
      });
    } catch (error) {
      this.logger.error('Delete channel', error.stack);
      throw new UnknownErrorException(JSON.stringify(error));
    }
  }

  async addCreative(creatives: AddCreativeDto[]) {
    try {
      return await this.prisma.creative.createMany({
        data: creatives,
      });
    } catch (error) {
      throw new UnknownErrorException(JSON.stringify(error));
    }
  }

  async deleteCreative(creativeId: number) {
    try {
      return await this.prisma.creative.delete({
        where: {
          id: creativeId,
        },
      });
    } catch (error) {
      throw new UnknownErrorException(JSON.stringify(error));
    }
  }

  async getCreative(creativeId: number) {
    const create = await this.prisma.creative.findUnique({
      where: { id: creativeId },
    });

    if (!create) {
      throw new NotFoundException(`Нет креатива с id: ${creativeId}`);
    }

    return create;
  }
  async changeCreativeStatus(creativeId: number) {
    const creative = await this.getCreative(creativeId);

    try {
      return await this.prisma.creative.update({
        where: {
          id: creativeId,
        },
        data: {
          status: creative.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE',
        },
      });
    } catch (error) {
      throw new UnknownErrorException(JSON.stringify(error));
    }
  }
}
