import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  client() {
    if (process.env.NODE_ENV === 'production') {
      return new PrismaClient();
    }

    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }

    return global.prisma;
  }
}
