import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prismaService = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: string) => {
              if (key === 'NODE_ENV') return 'test';
              return defaultValue;
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should return status ok when database is healthy', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result.status).toBe('ok');
  });

  it('should return service name vitrin-backend', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result.service).toBe('vitrin-backend');
  });

  it('should return timestamp', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('should return uptime as a number', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(typeof result.uptime).toBe('number');
  });

  it('should return environment from ConfigService', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result.environment).toBeDefined();
  });

  it('should return database as up when query succeeds', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result.database).toBe('up');
  });

  it('should throw ServiceUnavailableException when database query fails', async () => {
    prismaService.$queryRaw.mockRejectedValue(new Error('Connection refused'));
    await expect(service.check()).rejects.toThrow(ServiceUnavailableException);
  });

  it('should not expose database error details', async () => {
    prismaService.$queryRaw.mockRejectedValue(
      new Error('SQLITE_CANTOPEN: unable to open database file'),
    );
    try {
      await service.check();
      fail('Expected ServiceUnavailableException');
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceUnavailableException);
    }
  });

  it('should preserve all response fields on success', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('service', 'vitrin-backend');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('uptime');
    expect(result).toHaveProperty('environment');
    expect(result).toHaveProperty('database', 'up');
  });
});
