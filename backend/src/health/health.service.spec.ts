import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
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
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should return status ok', () => {
    const result = service.check();
    expect(result.status).toBe('ok');
  });

  it('should return service name vitrin-backend', () => {
    const result = service.check();
    expect(result.service).toBe('vitrin-backend');
  });

  it('should return timestamp', () => {
    const result = service.check();
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('should return uptime as a number', () => {
    const result = service.check();
    expect(typeof result.uptime).toBe('number');
  });

  it('should return environment from ConfigService', () => {
    const result = service.check();
    expect(result.environment).toBeDefined();
  });
});
