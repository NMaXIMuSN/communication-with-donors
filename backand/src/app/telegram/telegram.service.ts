import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

const telegraf = new Telegraf(process.env.TG_BOT_KEY as string);
telegraf.launch();

@Injectable()
export class TelegramService {
  private bot = telegraf;
  private botSend = telegraf.telegram;

  constructor(private logger: Logger) {
    this.bot.command('chatId', (ctx) => this.handleChatIdCommand(ctx));
  }

  private handleChatIdCommand(ctx: any) {
    const chatId = ctx.chat.id;
    ctx.reply(`Chat ID: \`${chatId}\``, { parse_mode: 'Markdown' });
  }

  async sendMessage(
    chatId: string | number,
    message: string,
  ): Promise<Message.TextMessage | undefined> {
    try {
      return await this.botSend.sendMessage(chatId, message, {
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
