import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    UsersService,
    PrismaService,
    Logger,
    MailService,
    AuthService,
    JwtService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
