import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CareersService } from './careers.service.js';

const career = {
  id: 1n,
  nombre: 'Carrera de prueba',
  duracion: '2 años',
  modalidad: 'Presencial',
  descripcion: 'Descripción de prueba',
};

const createDto = {
  nombre: career.nombre,
  duracion: career.duracion,
  modalidad: career.modalidad,
  descripcion: career.descripcion,
};

describe('CareersService', () => {
  let service: CareersService;
  const prismaMock = {
    careers: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<CareersService>(CareersService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe crear y serializar un ID BigInt', async () => {
    prismaMock.careers.create.mockResolvedValue(career);
    await expect(service.create(createDto)).resolves.toEqual({
      ...career,
      id: '1',
    });
    expect(prismaMock.careers.create).toHaveBeenCalledWith({ data: createDto });
  });

  it('debe listar carreras reales', async () => {
    prismaMock.careers.findMany.mockResolvedValue([career]);
    await expect(service.findAll()).resolves.toEqual([{ ...career, id: '1' }]);
  });

  it('debe devolver 404 para una carrera inexistente', async () => {
    prismaMock.careers.findUnique.mockResolvedValue(null);
    await expect(service.findOne('999')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('debe rechazar un ID inválido con 400', async () => {
    await expect(service.findOne('abc')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.findOne('0')).rejects.toBeInstanceOf(BadRequestException);
    expect(prismaMock.careers.findUnique).not.toHaveBeenCalled();
  });

  it('debe rechazar una carrera con nombre duplicado con 409', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('Duplicado', {
      code: 'P2002',
      clientVersion: '7.10.1',
    });
    prismaMock.careers.create.mockRejectedValue(prismaError);
    await expect(service.create(createDto)).rejects.toBeInstanceOf(ConflictException);
  });

  it('debe actualizar una carrera existente', async () => {
    const actualizada = { ...career, modalidad: 'Virtual' };
    prismaMock.careers.update.mockResolvedValue(actualizada);
    await expect(service.update('1', { modalidad: 'Virtual' })).resolves.toEqual({
      ...actualizada,
      id: '1',
    });
  });

  it('debe devolver 404 cuando se actualiza un registro inexistente', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('No encontrado', {
      code: 'P2025',
      clientVersion: '7.10.1',
    });
    prismaMock.careers.update.mockRejectedValue(prismaError);
    await expect(service.update('999', { modalidad: 'Virtual' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('debe eliminar una carrera y devolver sus datos', async () => {
    prismaMock.careers.delete.mockResolvedValue(career);
    await expect(service.remove('1')).resolves.toEqual({ ...career, id: '1' });
  });
});
