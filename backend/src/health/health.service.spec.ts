import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: { $queryRawUnsafe: jest.Mock };

  beforeEach(async () => {
    prismaService = { $queryRawUnsafe: jest.fn() };

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

  it('should return status ok', async () => {
    const result = await service.check();
    expect(result.status).toBe('ok');
  });

  it('should return service name vitrin-backend', async () => {
    const result = await service.check();
    expect(result.service).toBe('vitrin-backend');
  });

  it('should return timestamp', async () => {
    const result = await service.check();
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('should return uptime as a number', async () => {
    const result = await service.check();
    expect(typeof result.uptime).toBe('number');
  });

  it('should return environment from ConfigService', async () => {
    const result = await service.check();
    expect(result.environment).toBeDefined();
  });

  it('should return database as up when query succeeds', async () => {
    prismaService.$queryRawUnsafe.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result.database).toBe('up');
  });

  it('should return database as down when query fails', async () => {
    prismaService.$queryRawUnsafe.mockRejectedValue(new Error('Connection refused'));
    const result = await service.check();
    expect(result.database).toBe('down');
  });

  it('should preserve all existing response fields', async () => {
    prismaService.$queryRawUnsafe.mockResolvedValue([{ '1': 1 }]);
    const result = await service.check();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('service');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('uptime');
    expect(result).toHaveProperty('environment');
    expect(result).toHaveProperty('database');
  });
});
