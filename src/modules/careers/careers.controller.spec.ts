import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { CareersController } from './careers.controller.js';
import { CareersService } from './careers.service.js';

describe('CareersController', () => {
  let controller: CareersController;

  const serviceMock = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareersController],
      providers: [
        {
          provide: CareersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<CareersController>(CareersController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe pasar el ID sin perder precisión', async () => {
    const id = '9223372036854775807';

    await controller.findOne(id);

    expect(serviceMock.findOne).toHaveBeenCalledWith(id);
  });
});