import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@internal/prisma/client';

@Injectable()
export class PrismaDonorService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
