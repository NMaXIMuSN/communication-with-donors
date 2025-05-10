import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SourcesModule } from './sources/sources.module';
import { SegmentsModule } from './segments/segments.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { TemplatesModule } from './templates/templates.module';
import { OffersModule } from './offers/offers.module';
import { TelegramModule } from './telegram/telegram.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DonorsModule } from './donors/donors.module';
import { MailModule } from './mail/mail.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionsService } from './permissions/permissions.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PermissionsModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    SourcesModule,
    SegmentsModule,
    CampaignsModule,
    TemplatesModule,
    OffersModule,
    TelegramModule,
    ScheduleModule.forRoot(),
    DonorsModule,
    MailModule,
  ],
  controllers: [],
  providers: [PermissionsService],
})
export class AppModule {}
