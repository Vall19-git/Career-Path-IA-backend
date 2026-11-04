import { Test, TestingModule } from '@nestjs/testing';
import { LearningRoutesService } from './learning-routes.service.js';

describe('LearningRoutesService', () => {
  let service: LearningRoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearningRoutesService],
    }).compile();

    service = module.get<LearningRoutesService>(LearningRoutesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
