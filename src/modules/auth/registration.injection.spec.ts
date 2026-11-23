import 'reflect-metadata';

import { describe, expect, it } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RegistrationService } from './registration.service.js';

describe('RegistrationService - inyección de dependencias', () => {
  it('declara PrismaService como dependencia en NestJS', () => {
    const tipos = Reflect.getMetadata('design:paramtypes', RegistrationService) as unknown[];
    expect(tipos).toEqual([PrismaService]);
  });
});
