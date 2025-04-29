import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { $Enums, Template, TemplateSettings, User } from '@prisma/client';
import { ISearchVariables } from '../type';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../permissions/permission.guadr';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post('search')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.TEMPLATE, $Enums.Action.SEARCH)
  search(
    @Body()
    data: ISearchVariables<
      Template,
      {
        type: $Enums.TemplateType[];
      }
    >,
  ) {
    return this.templatesService.search(data);
  }

  @Post('')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.TEMPLATE, $Enums.Action.CREATE)
  create(@Body() data: Template, @Req() { user }: { user: User }) {
    return this.templatesService.create(data, user.id);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.TEMPLATE, $Enums.Action.VIEW)
  getOne(@Param('id') id: string) {
    return this.templatesService.getTemplate(+id);
  }

  @Post(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.TEMPLATE, $Enums.Action.EDIT)
  update(
    @Body()
    data: Template & {
      settings: (Partial<TemplateSettings> & Omit<TemplateSettings, 'id'>)[];
    },
    @Param('id') id: string,
    @Req() { user }: { user: User },
  ) {
    return this.templatesService.update(+id, data, user.id);
  }
}
