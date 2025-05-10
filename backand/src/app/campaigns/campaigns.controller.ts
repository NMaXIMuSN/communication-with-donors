import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ICampaignCreate } from './type';
import { $Enums, Campaign, User } from '@prisma/client';
import { AddCreativeDto } from './dto/creative.dto';
import { ISearchVariables } from '../type';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../permissions/permission.guadr';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.CREATE)
  async create(
    @Body() createCampaign: ICampaignCreate,
    @Req() { user }: { user: User },
  ) {
    return await this.campaignsService.create(createCampaign, user.id);
  }

  @Post('/search')
  @UseGuards(JwtAuthGuard)
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.SEARCH)
  async search(
    @Body()
    variables: ISearchVariables<
      Campaign,
      {
        channels: $Enums.ChannelType[];
      }
    >,
  ) {
    return this.campaignsService.search(variables);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.SEARCH)
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.VIEW)
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(+id);
  }

  @Post(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  async update(@Param('id') id: string, @Body() updateCampaignDto: any) {
    return await this.campaignsService.update(+id, updateCampaignDto);
  }

  @Get(':id/channels')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.VIEW)
  getChannels(@Param('id') id: string) {
    return this.campaignsService.getChannels(+id);
  }

  @Post(':id/channels')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  createChannel(
    @Param('id') id: string,
    @Body() { type }: { type: $Enums.ChannelType },
  ) {
    return this.campaignsService.createChannels(+id, type);
  }

  @Delete(':id/channel/:idCreative')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  deleteChannel(
    @Param('id') id: string,
    @Param('idCreative') idCreative: string,
  ) {
    return this.campaignsService.deleteChannel(+id, +idCreative);
  }

  @Post(':id/channels/creatives/add')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  addCreative(@Body() data: AddCreativeDto[]) {
    return this.campaignsService.addCreative(data);
  }

  @Delete(':id/channels/creatives/:creativeId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  deleteCreative(@Param('creativeId') id: string) {
    return this.campaignsService.deleteCreative(+id);
  }

  @Post(':id/channels/creatives/:creativeId/status')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  switchCreativeStatus(@Param('creativeId') id: string) {
    return this.campaignsService.changeCreativeStatus(+id);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.DELETE)
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(+id);
  }

  @Post(':id/status')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: { status: $Enums.CampaignStatus },
  ) {
    return await this.campaignsService.updateStatus(+id, status);
  }

  @Get(':id/status')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.CAMPAIGN, $Enums.Action.EDIT)
  async getStatus(@Param('id') id: string) {
    return await this.campaignsService.getStatus(+id);
  }
}
