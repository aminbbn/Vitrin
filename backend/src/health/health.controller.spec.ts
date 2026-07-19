import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prismaService: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prismaService = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
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

    controller = module.get<HealthController>(HealthController);
  });

  it('should return health status', async () => {
    prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
    const result = await controller.check();
    expect(result.status).toBe('ok');
  });

  describe('HTTP integration', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [HealthController],
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

      app = module.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    it('should return HTTP 200 with database up when healthy', async () => {
      prismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      const response = await request(app.getHttpServer()).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('database', 'up');
      expect(response.body).toHaveProperty('service', 'vitrin-backend');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });

    it('should return HTTP 503 when database query fails', async () => {
      prismaService.$queryRaw.mockRejectedValue(
        new Error('Connection refused'),
      );
      const response = await request(app.getHttpServer()).get('/health');
      expect(response.status).toBe(503);
      expect(response.body).toHaveProperty('statusCode', 503);
    });

    it('should not expose error details in 503 response', async () => {
      prismaService.$queryRaw.mockRejectedValue(
        new Error('SQLITE_CANTOPEN: unable to open database file'),
      );
      const response = await request(app.getHttpServer()).get('/health');
      expect(response.status).toBe(503);
      const body = JSON.stringify(response.body);
      expect(body).not.toContain('SQLITE');
      expect(body).not.toContain('CANTOPEN');
      expect(body).not.toContain('database file');
    });
  });
});
