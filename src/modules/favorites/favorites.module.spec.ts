import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { FavoritesModule } from './favorites.module.js';
import { FavoritesService } from './favorites.service.js';
import { FavoritesController } from './favorites.controller.js';

const providers = (): unknown[] =>
  Reflect.getMetadata('providers', FavoritesModule) as unknown[];

const controllers = (): unknown[] =>
  Reflect.getMetadata('controllers', FavoritesModule) as unknown[];

describe('FavoritesModule', () => {
  it('expone un módulo de NestJS', () => {
    expect(FavoritesModule).toBeDefined();
    expect(typeof FavoritesModule).toBe('function');
  });

  it('registra su servicio específico', () => {
    expect(providers()).toContain(FavoritesService);
  });

  it('registra PrismaService para la inyección', () => {
    expect(providers()).toContain(PrismaService);
  });

  it('registra su controlador', () => {
    expect(controllers()).toContain(FavoritesController);
  });

  it('no agrega proveedores duplicados', () => {
    const current = providers();
    expect(new Set(current).size).toBe(current.length);
  });

  it('no agrega controladores duplicados', () => {
    const current = controllers();
    expect(new Set(current).size).toBe(current.length);
  });

  it('mantiene exactamente el servicio y Prisma', () => {
    expect(providers()).toHaveLength(2);
  });

  it('mantiene exactamente un controlador', () => {
    expect(controllers()).toHaveLength(1);
  });
});
