import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { VocationalTestsService } from './vocational-tests.service.js';

describe('VocationalTestsService', () => {
  let service: VocationalTestsService;

  const prismaMock = {
    test_questions: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  const question = {
    id: 1n,
    enunciado: '¿Te interesa trabajar con tecnología?',
    categoria: 'Tecnología',
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocationalTestsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<VocationalTestsService>(VocationalTestsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe crear una pregunta vocacional', async () => {
    prismaMock.test_questions.create.mockResolvedValue(question);

    const result = await service.create({
      enunciado: question.enunciado,
      categoria: question.categoria,
    });

    expect(result).toEqual({
      ...question,
      id: 1,
    });
  });

  it('debe listar las preguntas vocacionales', async () => {
    prismaMock.test_questions.findMany.mockResolvedValue([question]);

    const result = await service.findAll();

    expect(result).toEqual([
      {
        ...question,
        id: 1,
      },
    ]);
  });

  it('debe buscar una pregunta por id', async () => {
    prismaMock.test_questions.findUnique.mockResolvedValue(question);

    const result = await service.findOne(1);

    expect(result.id).toBe(1);
    expect(result.categoria).toBe('Tecnología');
  });

  it('debe devolver 400 para un id inválido', async () => {
    await expect(service.findOne(0)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('debe devolver 404 si la pregunta no existe', async () => {
    prismaMock.test_questions.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('debe actualizar una pregunta existente', async () => {
    prismaMock.test_questions.findUnique.mockResolvedValue(question);

    prismaMock.test_questions.update.mockResolvedValue({
      ...question,
      categoria: 'Tecnología y programación',
    });

    const result = await service.update(1, {
      categoria: 'Tecnología y programación',
    });

    expect(result.categoria).toBe('Tecnología y programación');
  });

  it('debe devolver 404 al actualizar una pregunta inexistente', async () => {
    prismaMock.test_questions.findUnique.mockResolvedValue(null);

    await expect(
      service.update(999999, {
        categoria: 'Tecnología',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('debe eliminar una pregunta existente', async () => {
    prismaMock.test_questions.findUnique.mockResolvedValue(question);
    prismaMock.test_questions.delete.mockResolvedValue(question);

    const result = await service.remove(1);

    expect(result.id).toBe(1);
  });

  it('debe devolver 404 al eliminar una pregunta inexistente', async () => {
    prismaMock.test_questions.findUnique.mockResolvedValue(null);

    await expect(service.remove(999999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
