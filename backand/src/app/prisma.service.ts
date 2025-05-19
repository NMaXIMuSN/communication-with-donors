import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const sslEnabled = process.env.DATABASE_SSL === 'true';

    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL + (sslEnabled ? '?salome=require' : ''),
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
