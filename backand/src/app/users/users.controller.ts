import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { UsersDto } from './dto/Users.dto';
import { ISearchVariables } from '../type';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // Регистрация нового пользователя
  @Post('register')
  async register(@Body() body: User): Promise<UsersDto> {
    const { email, password, name } = body;
    return new UsersDto(await this.usersService.create(email, name, password));
  }

  @Post('register/test')
  async registerTest() {
    // return await this.usersService.ad
  }

  @Post('add/user')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions($Enums.Entity.USER, $Enums.Action.CREATE)
  async addUser(@Body() data: { email: string; roleIds: number[] }) {
    console.log(12312412);
    return await this.usersService.addUser(data);
  }

  @Get('register/info/:hash')
  async getRegInfo(@Param('hash') hash: string) {
    return await this.usersService.getRegInfo(hash);
  }

  @Post('register/info/:hash')
  async getRegister(
    @Param('hash') hash: string,
    @Body() data: { name: string; password: string },
  ) {
    const { email } = await this.usersService.getInfoByHash(hash);

    const user = new UsersDto(
      await this.usersService.create(email, data.name, data.password),
    );

    return this.authService.login(user);
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
    try {
      return await this.usersService.searchUsers(data);
    } catch (error) {
      console.log(error);
    }
    // return {
    //   ...users,
    //   data: users.data.map((el) => new UsersDto(el)),
    // };
  }
}
