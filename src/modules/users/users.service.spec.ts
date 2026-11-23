import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  const prismaMock = {
    users: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  const user = {
    id: 1n,
    nombre: 'Leandro Nuñez',
    email: 'leandro@example.com',
  };

  let service: UsersService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UsersService(prismaMock as unknown as PrismaService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe listar usuarios sin datos sensibles', async () => {
    prismaMock.users.findMany.mockResolvedValue([user]);

    const result = await service.findAll();

    expect(result).toEqual([
      {
        ...user,
        id: '1',
      },
    ]);

    expect(result[0]).not.toHaveProperty('passwordHash');
  });

  it('debe buscar un usuario por id', async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);

    const result = await service.findOne(1);

    expect(result.id).toBe('1');
    expect(result.email).toBe('leandro@example.com');
  });

  it('debe devolver 400 para un id inválido', async () => {
    await expect(service.findOne(0)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('debe devolver 404 si el usuario no existe', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('debe buscar por email normalizado', async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);

    await service.findByEmail('  LEANDRO@EXAMPLE.COM  ');

    expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'leandro@example.com',
      },
      select: {
        id: true,
        nombre: true,
        email: true,
      },
    });
  });

  it('debe actualizar un usuario existente', async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    prismaMock.users.update.mockResolvedValue({
      ...user,
      nombre: 'Leandro',
    });

    const result = await service.update(1, {
      nombre: 'Leandro',
    });

    expect(result.nombre).toBe('Leandro');
  });

  it('debe devolver 409 si el email pertenece a otro usuario', async () => {
    prismaMock.users.findUnique
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce({
        id: 2n,
      });

    await expect(
      service.update(1, {
        email: 'otro@example.com',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('debe devolver 404 al actualizar un usuario inexistente', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(
      service.update(999999, {
        nombre: 'Leandro',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});