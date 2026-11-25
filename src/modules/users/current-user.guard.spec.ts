import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { CurrentUserGuard } from './current-user.guard.js';

const context = (sub: string, id: string): ExecutionContext => ({
  switchToHttp: () => ({ getRequest: () => ({ user: { sub }, params: { id } }) }),
} as unknown as ExecutionContext);

describe('CurrentUserGuard', () => {
  const guard = new CurrentUserGuard();
  it('permite consultar o modificar el usuario propio', () => {
    expect(guard.canActivate(context('15', '15'))).toBe(true);
  });
  it('prohíbe acceder a otro usuario', () => {
    expect(() => guard.canActivate(context('15', '16'))).toThrow(ForbiddenException);
  });
});
