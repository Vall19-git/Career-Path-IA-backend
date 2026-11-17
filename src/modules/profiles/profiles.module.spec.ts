import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProfilesModule } from './profiles.module.js';
import { ProfilesService } from './profiles.service.js';
import { ProfilesController } from './profiles.controller.js';

const providers = (): unknown[] =>
  Reflect.getMetadata('providers', ProfilesModule) as unknown[];

const controllers = (): unknown[] =>
  Reflect.getMetadata('controllers', ProfilesModule) as unknown[];

describe('ProfilesModule', () => {
  it('expone un módulo de NestJS', () => {
    expect(ProfilesModule).toBeDefined();
    expect(typeof ProfilesModule).toBe('function');
  });

  it('registra su servicio específico', () => {
    expect(providers()).toContain(ProfilesService);
  });

  it('registra PrismaService para la inyección', () => {
    expect(providers()).toContain(PrismaService);
  });

  it('registra su controlador', () => {
    expect(controllers()).toContain(ProfilesController);
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
