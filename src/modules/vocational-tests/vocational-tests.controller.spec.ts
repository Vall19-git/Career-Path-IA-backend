import { Test, TestingModule } from '@nestjs/testing';
import { VocationalTestsController } from './vocational-tests.controller.js';
import { VocationalTestsService } from './vocational-tests.service.js';

describe('VocationalTestsController', () => {
  let controller: VocationalTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocationalTestsController],
      providers: [VocationalTestsService],
    }).compile();

    controller = module.get<VocationalTestsController>(VocationalTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
