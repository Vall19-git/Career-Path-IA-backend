import { JwtService } from '@nestjs/jwt';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginService } from './login.service.js';
import { PasswordUtil } from './password.util.js';

describe('LoginService - token JWT firmado', () => {
  afterEach(() => vi.restoreAllMocks());

  it('emite un JWT verificable con sub, email y expiración sin datos sensibles', async () => {
    const jwt = new JwtService({ secret: 'secreto-solo-para-prueba-unitaria', signOptions: { expiresIn: '1h' } });
    const prismaMock = {
      users: {
        findUnique: vi.fn().mockResolvedValue({
          id: 123n,
          email: 'morena@example.com',
          passwordHash: '$2b$12$hash-de-prueba',
        }),
      },
    };
    vi.spyOn(PasswordUtil, 'compare').mockResolvedValue(true);
    const servicio = new LoginService(prismaMock as unknown as PrismaService, jwt);

    const respuesta = await servicio.login({
      email: 'morena@example.com',
      password: 'ClaveSegura123',
    });
    const payload = await jwt.verifyAsync<Record<string, unknown>>(respuesta.access_token);

    expect(payload.sub).toBe('123');
    expect(payload.email).toBe('morena@example.com');
    expect(payload.exp).toEqual(expect.any(Number));
    expect(payload).not.toHaveProperty('password');
    expect(payload).not.toHaveProperty('passwordHash');
  });
});
