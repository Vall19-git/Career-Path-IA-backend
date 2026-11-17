import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { LearningRoutesController } from './learning-routes.controller.js';
import { LearningRoutesService } from './learning-routes.service.js';

describe('LearningRoutesController', () => {
  let controller: LearningRoutesController;
  let service: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningRoutesController],
      providers: [{ provide: LearningRoutesService, useValue: service }],
    }).compile();
    controller = module.get<LearningRoutesController>(LearningRoutesController);
  });

  it('se define correctamente', () => {
    expect(controller).toBeDefined();
  });

  it('convierte los IDs a BigInt sin perder precisión', async () => {
    await controller.findOne('9007199254740993');
    expect(service.findOne).toHaveBeenCalledWith(9007199254740993n);
  });

  it('rechaza IDs de ruta inválidos con 400', () => {
    expect(() => controller.findOne('0')).toThrow(BadRequestException);
    expect(() => controller.findOne('abc')).toThrow(BadRequestException);
    expect(() => controller.findOne('9223372036854775808')).toThrow(BadRequestException);
    expect(() => controller.update('-1', { progreso: 20 })).toThrow(BadRequestException);
  });
});
