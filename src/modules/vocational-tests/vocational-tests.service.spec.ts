import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service.js';
import { VocationalTestsService } from './vocational-tests.service.js';

describe('VocationalTestsService', () => {
  let service: VocationalTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocationalTestsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<VocationalTestsService>(VocationalTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
