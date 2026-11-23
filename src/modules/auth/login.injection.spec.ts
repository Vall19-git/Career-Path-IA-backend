import 'reflect-metadata';

import { JwtService } from '@nestjs/jwt';
import { describe, expect, it } from 'vitest';

import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginService } from './login.service.js';

describe('LoginService - inyección de dependencias', () => {
  it('declara PrismaService y JwtService como dependencias NestJS', () => {
    const tipos = Reflect.getMetadata('design:paramtypes', LoginService) as unknown[];
    expect(tipos).toEqual([PrismaService, JwtService]);
  });
});
