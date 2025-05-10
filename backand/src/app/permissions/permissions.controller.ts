import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('')
  async getRole() {
    return await this.permissionsService.getRole();
  }

  @Get('info')
  async getRoleWithPermissions() {
    return await this.permissionsService.getRoleWithPermissions();
  }

  @Post('create')
  async createRole(@Body() data: { name: string; permissions: string[] }) {
    return await this.permissionsService.createRole(data);
  }

  @Post('update/:id')
  async updatedRole(
    @Body() data: { name: string; permissions: string[] },
    @Param('id') id: string,
  ) {
    return await this.permissionsService.updateRole(+id, data);
  }
}
