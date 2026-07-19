import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async check() {
    const base = {
      status: 'ok' as const,
      service: 'vitrin-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
    };

    let database: 'up' | 'down';
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      throw new ServiceUnavailableException();
    }

    return { ...base, database };
  }
}
