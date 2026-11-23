import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { PasswordUtil } from './password.util.js';

export interface LoginResponse {
  access_token: string;
}

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginAuthDto): Promise<LoginResponse> {
    const email = dto.email.trim().toLowerCase();

    const usuario = await this.prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    // Mensaje idéntico para correo inexistente, contraseña incorrecta
    // y usuarios antiguos que todavía no tienen contraseña.
    if (!usuario?.passwordHash) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const contraseñaValida = await PasswordUtil.compare(
      dto.password,
      usuario.passwordHash,
    );

    if (!contraseñaValida) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Los BigInt de PostgreSQL/Prisma deben convertirse a string.
    // El hash de contraseña nunca entra en el JWT.
    const access_token = await this.jwtService.signAsync({
      sub: usuario.id.toString(),
      email: usuario.email,
    });

    return { access_token };
  }
}
