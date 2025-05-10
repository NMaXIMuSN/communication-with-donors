import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TelegramService {
  private reconnectInterval = 30000; // 30 секунд

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private logger: Logger,
  ) {
    this.setupBot();
  }

  private setupBot() {
    this.bot.command('chatId', async (ctx) => {
      try {
        const chatId = ctx.chat.id;
        await ctx.reply(`Chat ID: ${chatId}`, { parse_mode: 'Markdown' });
      } catch (error) {
        this.logger.error('Ошибка при обработке команды /chatId', error);
      }
    });

    this.bot.catch((err) => {
      this.logger.error('Ошибка в Telegraf', err);
      setTimeout(() => this.reconnectBot(), this.reconnectInterval);
    });
  }

  private async reconnectBot() {
    try {
      await this.bot.launch();
      this.logger.log('Бот успешно переподключен');
    } catch (error) {
      this.logger.error('Ошибка при переподключении бота', error);
      setTimeout(() => this.reconnectBot(), this.reconnectInterval);
    }
  }

  private handleChatIdCommand(ctx: any) {
    const chatId = ctx.chat.id;
    ctx.reply(`Chat ID: \`${chatId}\``, { parse_mode: 'Markdown' });
  }

  async sendMessage(
    chatId: string | number,
    message: string,
  ): Promise<Message.TextMessage | undefined> {
    if (!this.bot?.telegram) {
      return;
    }
    try {
      return await this.bot.telegram?.sendMessage(chatId, message, {
        parse_mode: 'MarkdownV2',
      });
    } catch (error) {
      this.logger.log(`Failed to send message to ${chatId}:`, error.message);
      throw error;
    }
  }

  replacePlaceholdersWithSequentialNumbers(text: string): string {
    let counter = 1;
    return text.replace(/{{\s*[^}]+\s*}}/g, () => `$${counter++}`);
  }
}
