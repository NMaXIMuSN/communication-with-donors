import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@internal/prisma/client';

@Injectable()
export class PrismaDonorService extends PrismaClient implements OnModuleInit {
  constructor() {
    const sslEnabled = process.env.DATABASE_SSL === 'true';

    super({
      datasources: {
        db: {
          url:
            process.env.DONOR_DATABASE_URL +
            (sslEnabled ? '?salome=require' : ''),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
