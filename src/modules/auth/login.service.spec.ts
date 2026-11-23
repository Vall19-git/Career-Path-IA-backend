import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginService } from './login.service.js';
import { PasswordUtil } from './password.util.js';

describe('LoginService', () => {
  const prismaMock = {
    users: { findUnique: vi.fn() },
  };
  const jwtMock = {
    signAsync: vi.fn(),
  };

  const usuario = {
    id: 123n,
    email: 'morena@example.com',
    passwordHash: '$2b$12$hash-de-prueba',
  };
  const dto = {
    email: 'morena@example.com',
    password: 'ClaveSegura123',
  };

  let service: LoginService;
  let compareSpy: MockInstance<typeof PasswordUtil.compare>;

  beforeEach(() => {
    vi.restoreAllMocks();
    prismaMock.users.findUnique.mockReset();
    jwtMock.signAsync.mockReset();

    prismaMock.users.findUnique.mockResolvedValue(usuario);
    jwtMock.signAsync.mockResolvedValue('jwt-firmado-de-prueba');
    compareSpy = vi.spyOn(PasswordUtil, 'compare').mockResolvedValue(true);

    service = new LoginService(
      prismaMock as unknown as PrismaService,
      jwtMock as unknown as JwtService,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve un JWT cuando el login es válido', async () => {
    await expect(service.login(dto)).resolves.toEqual({
      access_token: 'jwt-firmado-de-prueba',
    });

    expect(compareSpy).toHaveBeenCalledWith(
      dto.password,
      usuario.passwordHash,
    );
  });

  it('firma un JWT con el ID BigInt como texto y el email', async () => {
    await service.login(dto);

    expect(jwtMock.signAsync).toHaveBeenCalledWith({
      sub: '123',
      email: 'morena@example.com',
    });
  });

  it('busca el correo normalizado y selecciona solo datos necesarios', async () => {
    await service.login({ ...dto, email: '  MORENA@EXAMPLE.COM  ' });

    expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
      where: { email: 'morena@example.com' },
      select: { id: true, email: true, passwordHash: true },
    });
  });

  it('rechaza una contraseña incorrecta con 401 sin emitir JWT', async () => {
    compareSpy.mockResolvedValue(false);

    await expect(service.login(dto)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwtMock.signAsync).not.toHaveBeenCalled();
  });

  it('rechaza un correo inexistente con 401 sin emitir JWT', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.login(dto)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(compareSpy).not.toHaveBeenCalled();
    expect(jwtMock.signAsync).not.toHaveBeenCalled();
  });

  it('rechaza a un usuario antiguo sin hash con 401', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      ...usuario,
      passwordHash: null,
    });

    await expect(service.login(dto)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(compareSpy).not.toHaveBeenCalled();
    expect(jwtMock.signAsync).not.toHaveBeenCalled();
  });

  it('usa el mismo mensaje en los tres casos de credenciales inválidas', async () => {
    const mensajes: string[] = [];

    for (const caso of ['inexistente', 'sin-hash', 'incorrecta']) {
      prismaMock.users.findUnique.mockResolvedValue(
        caso === 'inexistente'
          ? null
          : { ...usuario, passwordHash: caso === 'sin-hash' ? null : usuario.passwordHash },
      );
      compareSpy.mockResolvedValue(
        caso !== 'incorrecta',
      );

      try {
        await service.login(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        mensajes.push((error as UnauthorizedException).message);
      }
    }

    expect(mensajes).toEqual([
      'Credenciales incorrectas.',
      'Credenciales incorrectas.',
      'Credenciales incorrectas.',
    ]);
  });

  it('no incluye passwordHash ni password en la respuesta o los claims', async () => {
    const resultado = await service.login(dto);
    const claims = jwtMock.signAsync.mock.calls[0]?.[0];

    expect(resultado).not.toHaveProperty('passwordHash');
    expect(resultado).not.toHaveProperty('password');
    expect(claims).not.toHaveProperty('passwordHash');
    expect(claims).not.toHaveProperty('password');
    expect(() => JSON.stringify(resultado)).not.toThrow();
  });
});
