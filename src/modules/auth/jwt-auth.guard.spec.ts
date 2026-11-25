import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi } from 'vitest';
import { JwtAuthGuard } from './jwt-auth.guard.js';

function makeContext(authorization?: string, user?: Record<string, unknown>) {
  const request = { headers: { authorization }, user };
  return {
    request,
    context: {
      getHandler: () => function endpoint() {},
      getClass: () => class Controller {},
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext,
  };
}

describe('JwtAuthGuard', () => {
  it('permite controladores públicos sin token', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(true) };
    const jwt = { verifyAsync: vi.fn() };
    const guard = new JwtAuthGuard(reflector as unknown as Reflector, jwt as unknown as JwtService);
    const { context } = makeContext();
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('rechaza solicitudes sin Bearer JWT', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) };
    const jwt = { verifyAsync: vi.fn() };
    const guard = new JwtAuthGuard(reflector as unknown as Reflector, jwt as unknown as JwtService);
    await expect(guard.canActivate(makeContext().context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rechaza tokens vencidos o con firma inválida', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) };
    const jwt = { verifyAsync: vi.fn().mockRejectedValue(new Error('Token inválido')) };
    const guard = new JwtAuthGuard(reflector as unknown as Reflector, jwt as unknown as JwtService);
    await expect(guard.canActivate(makeContext('Bearer token-falso').context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('adjunta el usuario autenticado con un JWT válido', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) };
    const jwt = { verifyAsync: vi.fn().mockResolvedValue({ sub: '42', email: 'user@example.com' }) };
    const guard = new JwtAuthGuard(reflector as unknown as Reflector, jwt as unknown as JwtService);
    const { context, request } = makeContext('Bearer token-valido');
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({ sub: '42', email: 'user@example.com' });
  });
});
