import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { FavoritesService } from './favorites.service.js';

const makeFavorite = (id = 1n, userId = 2n, careerId = 3n) => ({
  id,
  user_id: userId,
  career_id: careerId,
});

const prismaMock = {
  users: { findUnique: vi.fn() },
  careers: { findUnique: vi.fn() },
  favorites: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

const dto = { user_id: 2, career_id: 3 };
const prismaError = (code: string) => Object.assign(new Error(code), { code });

const relationsExist = () => {
  prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
  prismaMock.careers.findUnique.mockResolvedValue({ id: 3n });
};

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new FavoritesService(prismaMock as unknown as PrismaService);
    prismaMock.favorites.findFirst.mockResolvedValue(null);
  });

  describe('create', () => {
    it('crea el favorito cuando ambas relaciones existen', async () => {
      relationsExist();
      prismaMock.favorites.create.mockResolvedValue(makeFavorite());
      const result = await service.create(dto);
      expect(result).toEqual({ id: '1', user_id: '2', career_id: '3' });
      expect(prismaMock.favorites.create).toHaveBeenCalledWith({
        data: { user_id: 2n, career_id: 3n },
      });
    });

    it('comprueba usuario antes de comprobar carrera', async () => {
      prismaMock.users.findUnique.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(prismaMock.careers.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.favorites.create).not.toHaveBeenCalled();
    });

    it('rechaza una carrera inexistente', async () => {
      prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
      prismaMock.careers.findUnique.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(prismaMock.favorites.create).not.toHaveBeenCalled();
    });

    it('rechaza un favorito ya guardado por el mismo usuario', async () => {
      relationsExist();
      prismaMock.favorites.findFirst.mockResolvedValue(makeFavorite());
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(prismaMock.favorites.create).not.toHaveBeenCalled();
    });

    it('filtra duplicados utilizando ambas claves', async () => {
      relationsExist();
      prismaMock.favorites.findFirst.mockResolvedValue(makeFavorite());
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(prismaMock.favorites.findFirst).toHaveBeenCalledWith({
        where: { user_id: 2n, career_id: 3n },
      });
    });

    it('traduce carrera o usuario eliminado concurrentemente', async () => {
      relationsExist();
      prismaMock.favorites.create.mockRejectedValue(prismaError('P2003'));
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('traduce índice único en HTTP 409', async () => {
      relationsExist();
      prismaMock.favorites.create.mockRejectedValue(prismaError('P2002'));
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('no oculta errores de infraestructura', async () => {
      const failure = new Error('connection unavailable');
      relationsExist();
      prismaMock.favorites.create.mockRejectedValue(failure);
      await expect(service.create(dto)).rejects.toBe(failure);
    });

    it('convierte IDs de respuesta a texto', async () => {
      relationsExist();
      prismaMock.favorites.create.mockResolvedValue(
        makeFavorite(9007199254740993n, 2n, 3n),
      );
      const result = await service.create(dto);
      expect(result.id).toBe('9007199254740993');
      expect(() => JSON.stringify(result)).not.toThrow();
    });
  });

  describe('findAll', () => {
    it('lista favoritos ordenados', async () => {
      prismaMock.favorites.findMany.mockResolvedValue([
        makeFavorite(1n),
        makeFavorite(2n, 2n, 4n),
      ]);
      const result = await service.findAll();
      expect(result.map((item) => item.id)).toEqual(['1', '2']);
      expect(prismaMock.favorites.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });

    it('devuelve lista vacía cuando no existen favoritos', async () => {
      prismaMock.favorites.findMany.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });

    it('mantiene user_id y career_id al serializar', async () => {
      prismaMock.favorites.findMany.mockResolvedValue([makeFavorite(8n, 9n, 10n)]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: '8', user_id: '9', career_id: '10' }]);
    });

    it('propaga los fallos inesperados de lectura', async () => {
      const failure = new Error('read error');
      prismaMock.favorites.findMany.mockRejectedValue(failure);
      await expect(service.findAll()).rejects.toBe(failure);
    });
  });

  describe('findOne', () => {
    it('obtiene favorito por ID', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
      expect(prismaMock.favorites.findUnique).toHaveBeenCalledWith({
        where: { id: 1n },
      });
    });

    it('retorna 404 para un favorito ausente', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(null);
      await expect(service.findOne('50')).rejects.toThrow(NotFoundException);
    });

    it.each(['0', '-1', 'abc', '1.1', '+8', ' 2', '2 ', '']) (
      'rechaza el ID inválido %j',
      async (value) => {
        await expect(service.findOne(value)).rejects.toThrow(BadRequestException);
        expect(prismaMock.favorites.findUnique).not.toHaveBeenCalled();
      },
    );

    it('preserva precisión en IDs mayores al entero seguro de JavaScript', async () => {
      const value = '9007199254740993';
      prismaMock.favorites.findUnique.mockResolvedValue(
        makeFavorite(BigInt(value), 3n, 5n),
      );
      const result = await service.findOne(value);
      expect(result.id).toBe(value);
      expect(prismaMock.favorites.findUnique).toHaveBeenCalledWith({
        where: { id: BigInt(value) },
      });
    });
  });

  describe('update', () => {
    it('actualiza únicamente career_id', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockResolvedValue(makeFavorite(1n, 2n, 4n));
      const result = await service.update('1', { career_id: 4 });
      expect(result.career_id).toBe('4');
      expect(prismaMock.favorites.update).toHaveBeenCalledWith({
        where: { id: 1n },
        data: { career_id: 4n },
      });
    });

    it('actualiza únicamente user_id', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockResolvedValue(makeFavorite(1n, 5n, 3n));
      const result = await service.update('1', { user_id: 5 });
      expect(result.user_id).toBe('5');
      expect(prismaMock.favorites.update).toHaveBeenCalledWith({
        where: { id: 1n },
        data: { user_id: 5n },
      });
    });

    it('actualiza ambas relaciones juntas', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockResolvedValue(makeFavorite(1n, 4n, 5n));
      await service.update('1', { user_id: 4, career_id: 5 });
      expect(prismaMock.favorites.update).toHaveBeenCalledWith({
        where: { id: 1n },
        data: { user_id: 4n, career_id: 5n },
      });
    });

    it('usa el usuario original cuando sólo cambia carrera', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite(7n, 8n, 9n));
      relationsExist();
      prismaMock.favorites.update.mockResolvedValue(makeFavorite(7n, 8n, 10n));
      await service.update('7', { career_id: 10 });
      expect(prismaMock.favorites.findFirst).toHaveBeenCalledWith({
        where: { user_id: 8n, career_id: 10n, id: { not: 7n } },
      });
    });

    it('excluye el propio registro al buscar duplicados', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockResolvedValue(makeFavorite());
      await service.update('1', { career_id: 3 });
      expect(prismaMock.favorites.findFirst).toHaveBeenCalledWith({
        where: { user_id: 2n, career_id: 3n, id: { not: 1n } },
      });
    });

    it('rechaza la combinación existente en otro favorito', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.findFirst.mockResolvedValue(makeFavorite(8n));
      await expect(service.update('1', { career_id: 4 })).rejects.toThrow(ConflictException);
      expect(prismaMock.favorites.update).not.toHaveBeenCalled();
    });

    it('retorna 404 cuando el favorito original no existe', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(null);
      await expect(service.update('45', { career_id: 4 })).rejects.toThrow(NotFoundException);
    });

    it('rechaza un usuario inexistente al cambiar usuario', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      prismaMock.users.findUnique.mockResolvedValue(null);
      await expect(service.update('1', { user_id: 100 })).rejects.toThrow(NotFoundException);
      expect(prismaMock.favorites.update).not.toHaveBeenCalled();
    });

    it('rechaza una carrera inexistente al cambiar carrera', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      prismaMock.users.findUnique.mockResolvedValue({ id: 2n });
      prismaMock.careers.findUnique.mockResolvedValue(null);
      await expect(service.update('1', { career_id: 100 })).rejects.toThrow(NotFoundException);
      expect(prismaMock.favorites.update).not.toHaveBeenCalled();
    });

    it('rechaza ID de ruta inválido', async () => {
      await expect(service.update('abc', { career_id: 4 })).rejects.toThrow(BadRequestException);
      expect(prismaMock.favorites.update).not.toHaveBeenCalled();
    });

    it('traduce índice único en una colisión concurrente', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockRejectedValue(prismaError('P2002'));
      await expect(service.update('1', { career_id: 4 })).rejects.toThrow(ConflictException);
    });

    it('traduce pérdida concurrente de la relación', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockRejectedValue(prismaError('P2003'));
      await expect(service.update('1', { career_id: 4 })).rejects.toThrow(BadRequestException);
    });

    it('traduce borrado concurrente del favorito', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockRejectedValue(prismaError('P2025'));
      await expect(service.update('1', { career_id: 4 })).rejects.toThrow(NotFoundException);
    });

    it('conserva errores desconocidos para el filtro global', async () => {
      const failure = new Error('timeout');
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      relationsExist();
      prismaMock.favorites.update.mockRejectedValue(failure);
      await expect(service.update('1', { career_id: 4 })).rejects.toBe(failure);
    });

    it('permite PATCH vacío sin modificar relaciones', async () => {
      prismaMock.favorites.findUnique.mockResolvedValue(makeFavorite());
      prismaMock.favorites.update.mockResolvedValue(makeFavorite());
      const result = await service.update('1', {});
      expect(result.id).toBe('1');
      expect(prismaMock.users.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.careers.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('elimina un favorito y entrega confirmación', async () => {
      prismaMock.favorites.delete.mockResolvedValue(makeFavorite());
      const result = await service.remove('1');
      expect(result.mensaje).toBe('Favorito eliminado');
      expect(result.favorito).toEqual({ id: '1', user_id: '2', career_id: '3' });
      expect(prismaMock.favorites.delete).toHaveBeenCalledWith({ where: { id: 1n } });
    });

    it('traduce un borrado de favorito inexistente a 404', async () => {
      prismaMock.favorites.delete.mockRejectedValue(prismaError('P2025'));
      await expect(service.remove('20')).rejects.toThrow(NotFoundException);
    });

    it('rechaza ID inválido sin consultar Prisma', async () => {
      await expect(service.remove('-3')).rejects.toThrow(BadRequestException);
      expect(prismaMock.favorites.delete).not.toHaveBeenCalled();
    });

    it('propaga fallos desconocidos de eliminación', async () => {
      const failure = new Error('operación fallida');
      prismaMock.favorites.delete.mockRejectedValue(failure);
      await expect(service.remove('3')).rejects.toBe(failure);
    });

    it('convierte los tres identificadores a strings JSON', async () => {
      prismaMock.favorites.delete.mockResolvedValue(makeFavorite(50n, 60n, 70n));
      const result = await service.remove('50');
      expect(JSON.parse(JSON.stringify(result)).favorito).toEqual({
        id: '50', user_id: '60', career_id: '70',
      });
    });
  });
});
