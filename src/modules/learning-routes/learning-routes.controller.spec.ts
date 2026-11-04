import { Test, TestingModule } from '@nestjs/testing';
import { LearningRoutesController } from './learning-routes.controller.js';
import { LearningRoutesService } from './learning-routes.service.js';

describe('LearningRoutesController', () => {
  let controller: LearningRoutesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningRoutesController],
      providers: [LearningRoutesService],
    }).compile();

    controller = module.get<LearningRoutesController>(LearningRoutesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
