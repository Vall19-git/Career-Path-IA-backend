import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LearningRoutesService } from './learning-routes.service.js';

const route = {
  id: 6n,
  user_id: 1n,
  career_id: 2n,
  estado: 'En progreso',
  progreso: { toNumber: () => 45.5 },
};
const serialized = {
  id: '6',
  user_id: '1',
  career_id: '2',
  estado: 'En progreso',
  progreso: 45.5,
};
const createDto = {
  user_id: 1,
  career_id: 2,
  estado: 'En progreso',
  progreso: 45.5,
};

describe('LearningRoutesService', () => {
  let service: LearningRoutesService;
  let prisma: {
    users: { findUnique: ReturnType<typeof vi.fn> };
    careers: { findUnique: ReturnType<typeof vi.fn> };
    learning_routes: {
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
      learning_routes: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [LearningRoutesService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<LearningRoutesService>(LearningRoutesService);
  });

  it('se define correctamente', () => {
    expect(service).toBeDefined();
  });

  it('crea una ruta y serializa BigInt y Decimal', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.learning_routes.create.mockResolvedValue(route);

    await expect(service.create(createDto)).resolves.toEqual(serialized);
    expect(prisma.learning_routes.create).toHaveBeenCalledWith({
      data: { user_id: 1n, career_id: 2n, estado: 'En progreso', progreso: '45.5' },
    });
  });

  it('devuelve 404 si no existe el usuario', async () => {
    prisma.users.findUnique.mockResolvedValue(null);
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    await expect(service.create(createDto)).rejects.toThrow('Usuario no encontrado');
    expect(prisma.learning_routes.create).not.toHaveBeenCalled();
  });

  it('devuelve 404 si no existe la carrera', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue(null);
    await expect(service.create(createDto)).rejects.toThrow('Carrera no encontrada');
  });

  it('devuelve 409 cuando la ruta ya existe para usuario y carrera', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.learning_routes.create.mockRejectedValue({ code: 'P2002' });
    await expect(service.create(createDto)).rejects.toThrow(ConflictException);
  });

  it('lista rutas existentes', async () => {
    prisma.learning_routes.findMany.mockResolvedValue([route]);
    await expect(service.findAll()).resolves.toEqual([serialized]);
  });

  it('busca una ruta por ID', async () => {
    prisma.learning_routes.findUnique.mockResolvedValue(route);
    await expect(service.findOne(6n)).resolves.toEqual(serialized);
  });

  it('devuelve 404 al buscar una ruta inexistente', async () => {
    prisma.learning_routes.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999n)).rejects.toThrow(NotFoundException);
  });

  it('actualiza parcialmente estado y progreso', async () => {
    prisma.learning_routes.findUnique.mockResolvedValue(route);
    prisma.learning_routes.update.mockResolvedValue({
      ...route,
      estado: 'Finalizada',
      progreso: { toNumber: () => 100 },
    });
    await expect(service.update(6n, { estado: 'Finalizada', progreso: 100 })).resolves.toEqual({
      ...serialized,
      estado: 'Finalizada',
      progreso: 100,
    });
    expect(prisma.learning_routes.update).toHaveBeenCalledWith({
      where: { id: 6n },
      data: { estado: 'Finalizada', progreso: '100' },
    });
    expect(prisma.users.findUnique).not.toHaveBeenCalled();
  });

  it('valida relaciones al cambiar el usuario o la carrera', async () => {
    prisma.learning_routes.findUnique.mockResolvedValue(route);
    prisma.users.findUnique.mockResolvedValue({ id: 2n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.learning_routes.update.mockResolvedValue({ ...route, user_id: 2n });
    await service.update(6n, { user_id: 2 });
    expect(prisma.learning_routes.update).toHaveBeenCalledWith({
      where: { id: 6n }, data: { user_id: 2n },
    });
  });

  it('devuelve 404 al actualizar una ruta inexistente', async () => {
    prisma.learning_routes.findUnique.mockResolvedValue(null);
    await expect(service.update(999n, { progreso: 50 })).rejects.toThrow(NotFoundException);
  });

  it('devuelve 409 si cambiar la relación produce un duplicado', async () => {
    prisma.learning_routes.findUnique.mockResolvedValue(route);
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.learning_routes.update.mockRejectedValue({ code: 'P2002' });
    await expect(service.update(6n, { career_id: 2 })).rejects.toThrow(ConflictException);
  });

  it('elimina una ruta y devuelve sus datos', async () => {
    prisma.learning_routes.delete.mockResolvedValue(route);
    await expect(service.remove(6n)).resolves.toEqual(serialized);
  });

  it('devuelve 404 al eliminar una ruta inexistente', async () => {
    prisma.learning_routes.delete.mockRejectedValue({ code: 'P2025' });
    await expect(service.remove(999n)).rejects.toThrow(NotFoundException);
  });

  it('traduce errores de claves foráneas a 404', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1n });
    prisma.careers.findUnique.mockResolvedValue({ id: 2n });
    prisma.learning_routes.create.mockRejectedValue({ code: 'P2003' });
    await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
  });
});
