import { MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import Handlebars from 'handlebars';

import { readFileSync } from 'fs';

@Injectable()
export class MailService {
  handlebarsAdapter = new HandlebarsAdapter();
  constructor(private readonly mailerService: MailerService) {}

  async sendCampaignEmail(
    to: string = '89774964874m@gmail.com',
    dynamicHtmlContent: string,
  ) {
    await this.mailerService.sendMail({
      to,
      subject: 'Тестовая отправка',
      template: join(__dirname, './template.hbs'),
      context: {
        dynamicContent: dynamicHtmlContent,
        unsubscribeLink: 'http://example.com/unsubscribe?user=123',
        year: new Date().getFullYear(),
      },
    });
  }

  replacePlaceholdersWithSequentialNumbers(text: string): string {
    let counter = 1;
    // Регулярное выражение для поиска шаблонов {{key}}
    return text.replace(/{{\s*[^}]+\s*}}/g, () => `$${counter++}`);
  }

  generateEmailPreview(
    content: string,
    subject?: string,
  ): { content: string; subject?: string } {
    const templatePath = join(__dirname, `template.hbs`);
    const templateHbsFile = readFileSync(templatePath, 'utf8');

    // Компиляция шаблона
    const template = Handlebars.compile(templateHbsFile);

    return {
      content: template({
        dynamicContent: this.replacePlaceholdersWithSequentialNumbers(content),
        unsubscribeLink: 'http://example.com/unsubscribe?user=123',
        year: new Date().getFullYear(),
      }),
      subject: subject
        ? this.replacePlaceholdersWithSequentialNumbers(content)
        : undefined,
    };
  }

  async sendRegisterInfo(email: string, emailHash: string) {
    const token = encodeURIComponent(emailHash);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Регистрация в donor crm',
      template: join(__dirname, './confirmation.hbs'),
      context: {
        url: `http://localhost:3001/register?hash=${token}`,
        year: new Date().getFullYear(),
      },
    });
  }
}
