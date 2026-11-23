import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const publicUserSelect = {
  id: true,
  nombre: true,
  email: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException(
        'El identificador debe ser un número entero positivo.',
      );
    }
  }

  private serialize(user: { id: bigint; nombre: string; email: string }) {
    return { ...user, id: user.id.toString() };
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      select: publicUserSelect,
    });

    return users.map((user) => this.serialize(user));
  }

  async findOne(id: number) {
    this.validateId(id);

    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: publicUserSelect,
    });

    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id ${id}.`);
    }

    return this.serialize(user);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email: this.normalizeEmail(email) },
      select: publicUserSelect,
    });

    if (!user) {
      throw new NotFoundException(
        'No se encontró un usuario con ese correo electrónico.',
      );
    }

    return this.serialize(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    this.validateId(id);

    const existingUser = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`No se encontró el usuario con id ${id}.`);
    }

    if (dto.email) {
      const emailOwner = await this.prisma.users.findUnique({
        where: { email: this.normalizeEmail(dto.email) },
        select: { id: true },
      });

      if (emailOwner && emailOwner.id !== existingUser.id) {
        throw new ConflictException(
          'El correo electrónico ya está registrado.',
        );
      }
    }

    const user = await this.prisma.users.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.nombre !== undefined && { nombre: dto.nombre.trim() }),
        ...(dto.email !== undefined && {
          email: this.normalizeEmail(dto.email),
        }),
      },
      select: publicUserSelect,
    });

    return this.serialize(user);
  }
}