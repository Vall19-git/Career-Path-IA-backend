import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RecommendationsService } from './recommendations.service.js';

const recommendation = {
  id: 6n,
  user_id: 1n,
  career_id: 2n,
  puntaje: { toNumber: () => 87.5 },
};

const serialized = {
  id: '6',
  user_id: '1',
  career_id: '2',
  puntaje: 87.5,
};

const createDto = {
  user_id: 1,
  career_id: 2,
  puntaje: 87.5,
};

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let prisma: {
    users: { findUnique: ReturnType<typeof vi.fn> };
    careers: { findUnique: ReturnType<typeof vi.fn> };
    recommendations: {
      create: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    prisma = {
      users: { findUnique: vi.fn() },
      careers: { findUnique: vi.fn() },
      recommendations: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  it('se define correctamente', () => {
    expect(service).toBeDefined();
  });

  it('crea una recomendación con relaciones válidas y serializa BigInt y Decimal', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.recommendations.create.mockResolvedValue(recommendation);

    await expect(service.create(createDto)).resolves.toEqual(serialized);

    expect(prisma.recommendations.create).toHaveBeenCalledWith({
      data: {
        user_id: 1n,
        career_id: 2n,
        puntaje: '87.5',
      },
    });
  });

  it('rechaza un usuario inexistente (404)', async () => {
    prisma.users.findUnique.mockResolvedValue(null);
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });

    await expect(service.create(createDto)).rejects.toThrow(NotFoundException);

    expect(prisma.recommendations.create).not.toHaveBeenCalled();
  });

  it('rechaza una carrera inexistente (404)', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue(null);

    await expect(service.create(createDto)).rejects.toThrow(
      'Carrera no encontrada',
    );
  });

  it('devuelve 409 al repetir la combinación usuario/carrera', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.recommendations.create.mockRejectedValue({ code: 'P2002' });

    await expect(service.create(createDto)).rejects.toThrow(ConflictException);
  });

  it('lista las recomendaciones', async () => {
    prisma.recommendations.findMany.mockResolvedValue([recommendation]);

    await expect(service.findAll()).resolves.toEqual([serialized]);
  });

  it('busca una recomendación por ID', async () => {
    prisma.recommendations.findUnique.mockResolvedValue(recommendation);

    await expect(service.findOne(6n)).resolves.toEqual(serialized);
  });

  it('devuelve 404 al buscar un ID inexistente', async () => {
    prisma.recommendations.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999n)).rejects.toThrow(NotFoundException);
  });

  it('actualiza parcialmente la recomendación', async () => {
    prisma.recommendations.findUnique.mockResolvedValue(recommendation);
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });

    prisma.recommendations.update.mockResolvedValue({
      ...recommendation,
      puntaje: { toNumber: () => 92 },
    });

    await expect(service.update(6n, { puntaje: 92 })).resolves.toEqual({
      ...serialized,
      puntaje: 92,
    });

    expect(prisma.recommendations.update).toHaveBeenCalledWith({
      where: { id: 6n },
      data: {
        puntaje: '92',
      },
    });
  });

  it('devuelve 404 al actualizar una recomendación inexistente', async () => {
    prisma.recommendations.findUnique.mockResolvedValue(null);

    await expect(service.update(999n, { puntaje: 55 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('devuelve 409 cuando una actualización duplica usuario/carrera', async () => {
    prisma.recommendations.findUnique.mockResolvedValue(recommendation);
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.recommendations.update.mockRejectedValue({ code: 'P2002' });

    await expect(service.update(6n, { career_id: 2 })).rejects.toThrow(
      ConflictException,
    );
  });

  it('elimina una recomendación por ID', async () => {
    prisma.recommendations.delete.mockResolvedValue(recommendation);

    await expect(service.remove(6n)).resolves.toEqual(serialized);
  });

  it('devuelve 404 al eliminar una recomendación inexistente', async () => {
    prisma.recommendations.delete.mockRejectedValue({ code: 'P2025' });

    await expect(service.remove(999n)).rejects.toThrow(NotFoundException);
  });
});
