import { Logger, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService, Logger],
  exports: [],
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.TG_BOT_KEY as string,
      }),
    }),
  ],
})
export class TelegramModule {}
