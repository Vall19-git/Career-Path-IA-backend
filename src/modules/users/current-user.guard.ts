import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class CurrentUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: { sub: string };
      params: { id?: string };
    }>();
    if (!req.user?.sub || req.params.id !== req.user.sub) {
      throw new ForbiddenException('No tenés permisos para acceder a otro usuario.');
    }
    return true;
  }
}
