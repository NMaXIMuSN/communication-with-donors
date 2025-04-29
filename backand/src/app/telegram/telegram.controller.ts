import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../permissions/permission.guadr';
import { $Enums } from '@prisma/client';

@Controller('telegram')
@UseGuards(JwtAuthGuard)
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send')
  @UseGuards(PermissionsGuard)
  @RequirePermissions($Enums.Entity.TEMPLATE, $Enums.Action.EDIT)
  send(
    @Body()
    { message, chatId }: { message: string; chatId: string | number },
  ) {
    return this.telegramService.sendMessage(
      chatId,
      this.telegramService.replacePlaceholdersWithSequentialNumbers(message),
    );
  }
}
