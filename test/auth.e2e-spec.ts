import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { describe, expect, it, vi } from 'vitest';

import { AuthModule } from '../src/modules/auth/auth.module.js';
import { PrismaModule } from '../src/prisma/prisma.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Auth (E2E HTTP con Prisma simulado)', () => {
  it('registra, inicia sesión, valida el JWT y rechaza contraseña incorrecta', async () => {
    let user: { id: bigint; nombre: string; email: string; passwordHash: string } | undefined;
    const prisma = {
      users: {
        findUnique: vi.fn(async ({ where }: { where: { email: string } }) =>
          user?.email === where.email ? user : null,
        ),
        create: vi.fn(async ({ data }: { data: { nombre: string; email: string; passwordHash: string } }) => {
          user = { id: 1n, ...data };
          return user;
        }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ JWT_SECRET: 'clave-solo-prueba-http-e2e' })],
        }),
        PrismaModule,
        AuthModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    const app: INestApplication<App> = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    try {
      const datos = {
        nombre: 'Persona de Prueba',
        email: 'prueba-e2e@example.com',
        password: 'ClaveSegura123',
      };
      const registro = await request(app.getHttpServer())
        .post('/auth/register')
        .send(datos)
        .expect(201);

      expect(registro.body.user).toEqual({
        id: '1', nombre: datos.nombre, email: datos.email,
      });
      expect(registro.body.user).not.toHaveProperty('passwordHash');

      const inicio = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: datos.email, password: datos.password })
        .expect(200);

      expect(inicio.body.access_token).toEqual(expect.any(String));
      const jwt = moduleFixture.get(JwtService);
      const payload = await jwt.verifyAsync<{ sub: string; email: string }>(inicio.body.access_token);
      expect(payload.sub).toBe('1');
      expect(payload.email).toBe(datos.email);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: datos.email, password: 'ClaveIncorrecta' })
        .expect(401);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(datos)
        .expect(409);
    } finally {
      await app.close();
    }
  }, 20000);
});
