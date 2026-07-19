import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prismaService: { $queryRawUnsafe: jest.Mock };

  beforeEach(async () => {
    prismaService = { $queryRawUnsafe: jest.fn() };

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
    prismaService.$queryRawUnsafe.mockResolvedValue([{ '1': 1 }]);
    const result = await controller.check();
    expect(result.status).toBe('ok');
  });
});
