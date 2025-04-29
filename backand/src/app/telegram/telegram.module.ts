import { Logger, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService, Logger],
  exports: [],
  imports: [],
})
export class TelegramModule {}
