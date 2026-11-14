import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProfilesService } from './profiles.service.js';

const makeProfile = (
  id = 1n,
  userId = 2n,
  intereses = 'Tecnología',
  habilidades = 'Análisis',
) => ({ id, user_id: userId, intereses, habilidades });

const prismaMock = {
  users: { findUnique: vi.fn() },
  profiles: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

const dto = {
  user_id: 2,
  intereses: 'Tecnología',
  habilidades: 'Análisis',
};

const prismaError = (code: string) => Object.assign(new Error(code), { code });

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ProfilesService(prismaMock as unknown as PrismaService);
  });

  describe('create', () => {
    it('crea un perfil con un usuario existente', async () => {
      prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
      prismaMock.profiles.create.mockResolvedValue(makeProfile());
      const result = await service.create(dto);
      expect(result).toEqual({ ...dto, id: '1', user_id: '2' });
      expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
        where: { id: 2n },
      });
      expect(prismaMock.profiles.create).toHaveBeenCalledWith({
        data: { user_id: 2n, intereses: 'Tecnología', habilidades: 'Análisis' },
      });
    });

    it('no crea un perfil si el usuario no existe', async () => {
      prismaMock.users.findUnique.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(prismaMock.profiles.create).not.toHaveBeenCalled();
    });

    it('convierte un duplicado de Prisma en HTTP 409', async () => {
      prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
      prismaMock.profiles.create.mockRejectedValue(prismaError('P2002'));
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('convierte una relación inválida en HTTP 400', async () => {
      prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
      prismaMock.profiles.create.mockRejectedValue(prismaError('P2003'));
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('no oculta errores desconocidos de la base', async () => {
      const failure = new Error('database unavailable');
      prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
      prismaMock.profiles.create.mockRejectedValue(failure);
      await expect(service.create(dto)).rejects.toBe(failure);
    });

    it('preserva textos con tildes y espacios', async () => {
      const content = { user_id: 2, intereses: 'Música y robótica', habilidades: 'Diseño gráfico' };
      prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
      prismaMock.profiles.create.mockResolvedValue(
        makeProfile(10n, 2n, content.intereses, content.habilidades),
      );
      const result = await service.create(content);
      expect(result.intereses).toBe('Música y robótica');
      expect(result.habilidades).toBe('Diseño gráfico');
    });
  });

  describe('findAll', () => {
    it('lista perfiles ordenados por identificador', async () => {
      prismaMock.profiles.findMany.mockResolvedValue([makeProfile(1n), makeProfile(2n)]);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(prismaMock.profiles.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });

    it('devuelve una lista vacía cuando no hay perfiles', async () => {
      prismaMock.profiles.findMany.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });

    it('serializa identificadores BigInt grandes sin perder precisión', async () => {
      prismaMock.profiles.findMany.mockResolvedValue([
        makeProfile(9007199254740993n, 9007199254740995n),
      ]);
      const result = await service.findAll();
      expect(result[0].id).toBe('9007199254740993');
      expect(result[0].user_id).toBe('9007199254740995');
      expect(() => JSON.stringify(result)).not.toThrow();
    });

    it('propaga fallos de lectura', async () => {
      const failure = new Error('lectura interrumpida');
      prismaMock.profiles.findMany.mockRejectedValue(failure);
      await expect(service.findAll()).rejects.toBe(failure);
    });
  });

  describe('findOne', () => {
    it('obtiene un perfil por ID', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      expect((await service.findOne('1')).id).toBe('1');
      expect(prismaMock.profiles.findUnique).toHaveBeenCalledWith({
        where: { id: 1n },
      });
    });

    it('retorna 404 cuando el perfil no existe', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(null);
      await expect(service.findOne('9')).rejects.toThrow(NotFoundException);
    });

    it.each(['0', '-1', 'abc', '1.5', ' 1', '1 ', '+1', '']) (
      'rechaza el identificador inválido %j',
      async (invalid) => {
        await expect(service.findOne(invalid)).rejects.toThrow(BadRequestException);
        expect(prismaMock.profiles.findUnique).not.toHaveBeenCalled();
      },
    );

    it('admite IDs grandes cuando la ruta llega como texto', async () => {
      const large = '9007199254740993';
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile(BigInt(large)));
      const result = await service.findOne(large);
      expect(result.id).toBe(large);
      expect(prismaMock.profiles.findUnique).toHaveBeenCalledWith({
        where: { id: BigInt(large) },
      });
    });
  });

  describe('update', () => {
    it('actualiza únicamente los intereses', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.profiles.update.mockResolvedValue(makeProfile(1n, 2n, 'Ciencia'));
      const result = await service.update('1', { intereses: 'Ciencia' });
      expect(result.intereses).toBe('Ciencia');
      expect(prismaMock.profiles.update).toHaveBeenCalledWith({
        where: { id: 1n },
        data: { intereses: 'Ciencia' },
      });
    });

    it('actualiza únicamente las habilidades', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.profiles.update.mockResolvedValue(makeProfile(1n, 2n, 'Tecnología', 'Liderazgo'));
      const result = await service.update('1', { habilidades: 'Liderazgo' });
      expect(result.habilidades).toBe('Liderazgo');
      expect(prismaMock.profiles.update).toHaveBeenCalledWith({
        where: { id: 1n },
        data: { habilidades: 'Liderazgo' },
      });
    });

    it('permite actualizar intereses y habilidades juntos', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.profiles.update.mockResolvedValue(makeProfile(1n, 2n, 'Arte', 'Dibujo'));
      await service.update('1', { intereses: 'Arte', habilidades: 'Dibujo' });
      expect(prismaMock.profiles.update).toHaveBeenCalledWith({
        where: { id: 1n },
        data: { intereses: 'Arte', habilidades: 'Dibujo' },
      });
    });

    it('verifica el usuario cuando cambia user_id', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.users.findUnique.mockResolvedValue({ id: 3n });
      prismaMock.profiles.update.mockResolvedValue(makeProfile(1n, 3n));
      const result = await service.update('1', { user_id: 3 });
      expect(result.user_id).toBe('3');
      expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
        where: { id: 3n },
      });
    });

    it('rechaza cambiar hacia un usuario inexistente', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.users.findUnique.mockResolvedValue(null);
      await expect(service.update('1', { user_id: 99 })).rejects.toThrow(NotFoundException);
      expect(prismaMock.profiles.update).not.toHaveBeenCalled();
    });

    it('retorna 404 si falta el perfil', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(null);
      await expect(service.update('44', { intereses: 'Historia' })).rejects.toThrow(NotFoundException);
    });

    it('rechaza un identificador de ruta inválido', async () => {
      await expect(service.update('abc', { intereses: 'Historia' })).rejects.toThrow(BadRequestException);
      expect(prismaMock.profiles.findUnique).not.toHaveBeenCalled();
    });

    it('traduce conflicto de unicidad', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.profiles.update.mockRejectedValue(prismaError('P2002'));
      await expect(service.update('1', { intereses: 'A' })).rejects.toThrow(ConflictException);
    });

    it('traduce desaparición concurrente del perfil', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.profiles.update.mockRejectedValue(prismaError('P2025'));
      await expect(service.update('1', { intereses: 'A' })).rejects.toThrow(NotFoundException);
    });

    it('traduce error de clave foránea de Prisma', async () => {
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.profiles.update.mockRejectedValue(prismaError('P2003'));
      await expect(service.update('1', { intereses: 'A' })).rejects.toThrow(BadRequestException);
    });

    it('propaga los errores no reconocidos', async () => {
      const failure = new Error('operación cancelada');
      prismaMock.profiles.findUnique.mockResolvedValue(makeProfile());
      prismaMock.profiles.update.mockRejectedValue(failure);
      await expect(service.update('1', { intereses: 'A' })).rejects.toBe(failure);
    });
  });

  describe('remove', () => {
    it('elimina y confirma el perfil borrado', async () => {
      prismaMock.profiles.delete.mockResolvedValue(makeProfile());
      const result = await service.remove('1');
      expect(result.mensaje).toBe('Perfil eliminado');
      expect(result.perfil.id).toBe('1');
      expect(prismaMock.profiles.delete).toHaveBeenCalledWith({ where: { id: 1n } });
    });

    it('notifica 404 cuando ya no existe', async () => {
      prismaMock.profiles.delete.mockRejectedValue(prismaError('P2025'));
      await expect(service.remove('7')).rejects.toThrow(NotFoundException);
    });

    it('rechaza IDs de ruta que no son positivos', async () => {
      await expect(service.remove('-8')).rejects.toThrow(BadRequestException);
      expect(prismaMock.profiles.delete).not.toHaveBeenCalled();
    });

    it('conserva el mensaje del error original desconocido', async () => {
      const failure = new Error('timeout');
      prismaMock.profiles.delete.mockRejectedValue(failure);
      await expect(service.remove('1')).rejects.toBe(failure);
    });

    it('devuelve una estructura serializable como JSON', async () => {
      prismaMock.profiles.delete.mockResolvedValue(makeProfile(10n, 20n));
      const result = await service.remove('10');
      expect(JSON.parse(JSON.stringify(result))).toEqual({
        mensaje: 'Perfil eliminado',
        perfil: {
          id: '10', user_id: '20', intereses: 'Tecnología', habilidades: 'Análisis',
        },
      });
    });
  });
});
