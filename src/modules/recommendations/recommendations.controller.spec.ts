import { vi } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from './recommendations.controller.js';
import { RecommendationsService } from './recommendations.service.js';

describe('RecommendationsController', () => {
  let controller: RecommendationsController;
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
      controllers: [RecommendationsController],
      providers: [{ provide: RecommendationsService, useValue: service }],
    }).compile();
    controller = module.get<RecommendationsController>(RecommendationsController);
  });

  it('se define correctamente', () => {
    expect(controller).toBeDefined();
  });

  it('convierte los IDs de la ruta a BigInt sin perder precisión', async () => {
    await controller.findOne('9007199254740993');
    expect(service.findOne).toHaveBeenCalledWith(9007199254740993n);
  });

  it('rechaza IDs inválidos (400)', () => {
    expect(() => controller.findOne('0')).toThrow(BadRequestException);
    expect(() => controller.findOne('abc')).toThrow(BadRequestException);
    expect(() => controller.findOne('9223372036854775808')).toThrow(BadRequestException);
  });
});
