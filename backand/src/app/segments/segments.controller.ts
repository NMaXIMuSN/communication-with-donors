import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { $Enums, Prisma, Segment, User } from '@prisma/client';
import { ISearchVariables } from '../type';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../permissions/permission.guadr';

@Controller('segments')
@UseGuards(JwtAuthGuard)
export class SegmentsController {
  constructor(
    private readonly segmentsService: SegmentsService,
    private logger: Logger,
  ) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SEGMENT, $Enums.Action.CREATE)
  async create(
    @Body() createSegmentDto: Prisma.SegmentCreateArgs['data'],
    @Req() { user }: { user: User },
  ) {
    const res = await this.segmentsService.createSegment(
      createSegmentDto,
      user.id,
    );
    return res;
  }

  @Post('search')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SEGMENT, $Enums.Action.SEARCH)
  searchSources(@Body() data: ISearchVariables<Segment>) {
    return this.segmentsService.searchSegments(data);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SEGMENT, $Enums.Action.VIEW)
  async findOne(@Param('id') id: string) {
    console.log(id);

    return await this.segmentsService.findOne(+id);
  }

  @Get(':id/sources')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SEGMENT, $Enums.Action.VIEW)
  async getSource(@Param('id') id: string) {
    return await this.segmentsService.getSource(+id);
  }

  @Post(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SEGMENT, $Enums.Action.EDIT)
  async update(
    @Param('id') id: string,
    @Body() createSegmentDto: Prisma.SegmentCreateArgs['data'],
    @Req() { user }: { user: User },
  ) {
    return await this.segmentsService.update(+id, createSegmentDto, user.id);
  }

  @Post(':id/calculation')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SEGMENT, $Enums.Action.EDIT)
  calculation(@Param('id') id: string) {
    this.segmentsService.calculateSegment(+id);

    return $Enums.SegmentStatus.PROGRESS;
  }

  @Get(':id/status')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SEGMENT, $Enums.Action.VIEW)
  async getStatus(@Param('id') id: string) {
    return await this.segmentsService.getStatus(+id);
  }
}
