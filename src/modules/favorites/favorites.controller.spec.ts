import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesController } from './favorites.controller.js';
import { FavoritesService } from './favorites.service.js';

const serviceMock = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

const createDto = { user_id: 1, career_id: 2 };

describe('FavoritesController', () => {
  let controller: FavoritesController;

  beforeEach(() => {
    vi.resetAllMocks();
    controller = new FavoritesController(serviceMock as unknown as FavoritesService);
  });

  it('instancia el controlador', () => {
    expect(controller).toBeDefined();
  });

  it('delega POST y conserva el DTO recibido', async () => {
    serviceMock.create.mockResolvedValue({ id: '1' });
    expect(await controller.create(createDto)).toEqual({ id: '1' });
    expect(serviceMock.create).toHaveBeenCalledWith(createDto);
  });

  it('delega GET de colección al servicio', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: '1' }]);
    expect(await controller.findAll()).toEqual([{ id: '1' }]);
    expect(serviceMock.findAll).toHaveBeenCalledOnce();
  });

  it('delega GET individual sin convertir el ID a número', async () => {
    const id = '9007199254740993';
    serviceMock.findOne.mockResolvedValue({ id });
    expect(await controller.findOne(id)).toEqual({ id });
    expect(serviceMock.findOne).toHaveBeenCalledWith(id);
  });

  it('delega PATCH con ID de texto y cambios parciales', async () => {
    const changes = { user_id: 3 };
    serviceMock.update.mockResolvedValue({ id: '12' });
    expect(await controller.update('12', changes)).toEqual({ id: '12' });
    expect(serviceMock.update).toHaveBeenCalledWith('12', changes);
  });

  it('delega DELETE sin pérdida de precisión', async () => {
    const id = '9007199254740995';
    serviceMock.remove.mockResolvedValue({ mensaje: 'eliminado' });
    expect(await controller.remove(id)).toEqual({ mensaje: 'eliminado' });
    expect(serviceMock.remove).toHaveBeenCalledWith(id);
  });

  it('no intercepta errores del servicio en GET', async () => {
    const failure = new Error('registro inexistente');
    serviceMock.findOne.mockRejectedValue(failure);
    await expect(controller.findOne('99')).rejects.toBe(failure);
  });

  it('no intercepta errores del servicio en POST', async () => {
    const failure = new Error('datos inválidos');
    serviceMock.create.mockRejectedValue(failure);
    await expect(controller.create(createDto)).rejects.toBe(failure);
  });

  it('no intercepta errores del servicio en PATCH', async () => {
    const failure = new Error('actualización fallida');
    serviceMock.update.mockRejectedValue(failure);
    await expect(controller.update('12', {})).rejects.toBe(failure);
  });

  it('no intercepta errores del servicio en DELETE', async () => {
    const failure = new Error('eliminación fallida');
    serviceMock.remove.mockRejectedValue(failure);
    await expect(controller.remove('12')).rejects.toBe(failure);
  });
});
