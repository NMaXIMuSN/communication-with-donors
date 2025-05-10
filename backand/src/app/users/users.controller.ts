import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Logger,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { $Enums, User } from '@prisma/client';
import { UsersDto } from './dto/Users.dto';
import { ISearchVariables } from '../type';
import { AuthService } from '../auth/auth.service';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../permissions/permission.guadr';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private logger: Logger,
  ) {}

  @Post('add/user')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.USER, $Enums.Action.CREATE)
  async addUser(@Body() data: { email: string; roleIds: number[] }) {
    return await this.usersService.addUser(data);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Body() data: { password?: string; newPassword?: string; name: string },
    @Req() { user }: { user: User },
  ): Promise<void> {
    console.log(data);
    return await this.usersService.updateUserMe(user, data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): any {
    return req.user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findUser(@Param('id') id: string): Promise<UsersDto | null> {
    const user = await this.usersService.findOne(Number(id));
    if (!user) {
      return null;
    }
    return new UsersDto(user);
  }

  @Post('/search')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Body() data: ISearchVariables<User>): Promise<any | null> {
    return await this.usersService.searchUsers(data);
  }

  @Post('update/role/:email')
  @UseGuards(JwtAuthGuard)
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.USER, $Enums.Action.EDIT)
  async updateUserRole(
    @Body() roleIds: number[],
    @Param('email') email: string,
  ) {
    return await this.usersService.updateRole(email, roleIds);
  }
}
