import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('preview')
  preview(@Body() { content, subject }: { content: string; subject?: string }) {
    return this.mailService.generateEmailPreview(content, subject);
  }
}
