import { Injectable } from '@nestjs/common';
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

    const database = await this.checkDatabase();

    return { ...base, database };
  }

  private async checkDatabase(): Promise<'up' | 'down'> {
    try {
      await this.prismaService.$queryRawUnsafe('SELECT 1');
      return 'up';
    } catch {
      return 'down';
    }
  }
}
