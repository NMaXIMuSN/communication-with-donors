import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken,
      ]),

      secretOrKey: process.env.JWT_SECRET_KEY || '',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      return null;
    }

    return user;
  }
}
