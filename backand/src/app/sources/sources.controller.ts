import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { SourcesService } from './sources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { $Enums, Attribute, Source, User } from '@prisma/client';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../permissions/permission.guadr';

type AllowedValueJson = {
  text: string;
  value: string;
};

export interface ISourceUpdate extends Source {
  attributes: (Omit<Attribute, 'allowedValues'> & {
    allowedValues: AllowedValueJson[];
  })[];
}

@UseGuards(JwtAuthGuard)
@Controller('source')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Get('search')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SOURCE, $Enums.Action.SEARCH)
  searchSources(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'asc',
    @Query('search') search?: string,
  ) {
    return this.sourcesService.searchSources(+page, +limit, sort, search);
  }

  @Post('create')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SOURCE, $Enums.Action.CREATE)
  create(
    @Req() { user }: { user: User },
    @Body()
    body: ISourceUpdate,
  ) {
    return this.sourcesService.create({
      ...body,
      createdById: user.id,
    });
  }

  @Patch('update/:id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SOURCE, $Enums.Action.CREATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ISourceUpdate,
    @Req() req: { user: User },
  ) {
    return this.sourcesService.update(id, {
      ...body,
      updatedById: req.user.id,
    });
  }

  @Get(':systemName')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SOURCE, $Enums.Action.VIEW)
  findOne(@Param('systemName') systemName: string) {
    return this.sourcesService.getSourceById(systemName);
  }

  @Delete(':systemName')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SOURCE, $Enums.Action.DELETE)
  delete(@Param('systemName') systemName: string) {
    return this.sourcesService.deleteSource(systemName);
  }

  @Get('info/table/:tableName')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SOURCE, $Enums.Action.CREATE)
  async getInfo(@Param('tableName') tableName: string) {
    return await this.sourcesService.getDonorTableInfo(tableName);
  }

  @Get('available/tables')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.SOURCE, $Enums.Action.CREATE)
  getTables() {
    return this.sourcesService.getDonorTables();
  }
}
