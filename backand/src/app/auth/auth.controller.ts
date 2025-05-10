import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/Auth.dto';
import { UsersDto } from '../users/dto/Users.dto';
import { Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken } = this.authService.login(user);

    res.cookie('accessToken', accessToken, {
      maxAge: 3600000 * 24,
    });

    return { accessToken };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return;
  }

  @Get('register/info/:hash')
  async getRegInfo(@Param('hash') hash: string) {
    return await this.usersService.getRegInfo(hash);
  }

  @Post('register/info/:hash')
  async getRegister(
    @Param('hash') hash: string,
    @Body() data: { name: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, role } = await this.usersService.getInfoByHash(hash);

    const user = new UsersDto(
      await this.usersService.create(
        email,
        data.name,
        data.password,
        role.map(({ id }) => id),
      ),
    );

    const { accessToken } = this.authService.login(user);

    res.cookie('accessToken', accessToken, {
      maxAge: 3600000 * 24,
    });

    return { accessToken };
  }
}
