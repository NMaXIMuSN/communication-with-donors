import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

class MarkdownV2Escaper {
  private specialChars: string;
  private markdownPatterns: RegExp[];
  private combinedPattern: RegExp;

  constructor() {
    // Define special characters that need to be escaped in MarkdownV2
    this.specialChars = '_*\\[\\]()~`>#+-=|{}.!';

    // Define regex patterns for MarkdownV2 elements
    this.markdownPatterns = [
      /\*[^*]+\*/, // Bold
      /_[^_]+_/, // Italic
      /__[^_]+__/, // Underline
      /~[^~]+~/, // Strikethrough
      /\|\|[^|]+\|\|/, // Spoiler
      /\[([^\]]+)\]\(([^)]+)\)/, // Inline URL
      /`[^`]+`/, // Inline code
      /```(?:[^`]*?)```/, // Code blocks
      /```python\n[\s\S]*?\n```/, // Python code blocks
    ];

    // Combine all patterns into a single regex
    this.combinedPattern = new RegExp(
      this.markdownPatterns.map((pattern) => pattern.source).join('|'),
      'g',
    );
  }

  public escape(text: string): string {
    if (!text) {
      return text;
    }

    // Find all MarkdownV2 syntax matches
    const matches = [...text.matchAll(this.combinedPattern)];

    // Initialize variables
    const escapedText: string[] = [];
    let lastEnd = 0;

    for (const match of matches) {
      const [matchedText] = match;
      const start = match.index || 0;
      const end = start + matchedText.length;

      // Escape non-Markdown text before the current match
      if (lastEnd < start) {
        const nonMarkdownPart = text.slice(lastEnd, start);
        const escapedNonMarkdown = this._escapeNonMarkdown(nonMarkdownPart);
        escapedText.push(escapedNonMarkdown);
      }

      // Append the Markdown syntax without escaping
      escapedText.push(matchedText);
      lastEnd = end;
    }

    // Escape any remaining non-Markdown text after the last match
    if (lastEnd < text.length) {
      const remainingText = text.slice(lastEnd);
      const escapedRemaining = this._escapeNonMarkdown(remainingText);
      escapedText.push(escapedRemaining);
    }

    return escapedText.join('');
  }

  private _escapeNonMarkdown(text: string): string {
    let escaped = '';
    for (const char of text) {
      if (this.specialChars.includes(char)) {
        escaped += '\\' + char;
      } else {
        escaped += char;
      }
    }
    return escaped;
  }
}

@Injectable()
export class TelegramService {
  private reconnectInterval = 30000; // 30 секунд
  private MarkdownV2Escaper = new MarkdownV2Escaper();

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
        await ctx.reply(`Chat ID: \`${chatId}\``, { parse_mode: 'Markdown' });
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

  async sendMessage(
    chatId: string | number,
    message: string,
  ): Promise<Message.TextMessage | undefined> {
    if (!this.bot?.telegram) {
      return;
    }
    try {
      console.log(this.MarkdownV2Escaper.escape(message));

      return await this.bot.telegram?.sendMessage(
        chatId,
        this.MarkdownV2Escaper.escape(message),
        {
          parse_mode: 'MarkdownV2',
        },
      );
    } catch (error) {
      this.logger.log(
        `Failed to send message to ${chatId}:`,
        JSON.stringify(error),
      );
      throw error;
    }
  }

  replacePlaceholdersWithSequentialNumbers(text: string): string {
    let counter = 1;
    return text.replace(/{{\s*[^}]+\s*}}/g, () => `$${counter++}`);
  }
}
