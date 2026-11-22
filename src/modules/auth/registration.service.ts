import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import type { PrismaService } from '../../prisma/prisma.service.js';

import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { PasswordUtil } from './password.util.js';

export interface RegisteredUser {
  id: string;
  nombre: string;
  email: string;
}

export interface RegistrationResponse {
  message: string;
  user: RegisteredUser;
}

@Injectable()
export class RegistrationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async register(
    dto: RegisterAuthDto,
  ): Promise<RegistrationResponse> {
    const nombre = dto.nombre.trim();
    const email = dto.email.trim().toLowerCase();

    const usuarioExistente =
      await this.prisma.users.findUnique({
        where: { email },
        select: { id: true },
      });

    if (usuarioExistente) {
      throw new ConflictException(
        'Ya existe un usuario registrado con ese correo electrónico.',
      );
    }

    const passwordHash = await PasswordUtil.hash(
      dto.password,
    );

    try {
      const usuario = await this.prisma.users.create({
        data: {
          nombre,
          email,
          passwordHash,
        },
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      });

      return {
        message: 'Usuario registrado correctamente.',
        user: {
          id: usuario.id.toString(),
          nombre: usuario.nombre,
          email: usuario.email,
        },
      };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe un usuario registrado con ese correo electrónico.',
        );
      }

      throw error;
    }
  }
}
