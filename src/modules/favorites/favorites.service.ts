import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(value: string): bigint {
    if (!/^[1-9]\d*$/.test(value)) {
      throw new BadRequestException('ID inválido: debe ser un entero positivo');
    }
    return BigInt(value);
  }

  private serialize(favorite: { id: bigint; user_id: bigint; career_id: bigint }) {
    return {
      ...favorite,
      id: favorite.id.toString(),
      user_id: favorite.user_id.toString(),
      career_id: favorite.career_id.toString(),
    };
  }

  private errorCode(error: unknown): string | undefined {
    if (typeof error === 'object' && error !== null && 'code' in error) return String(error.code);
    return undefined;
  }

  private async checkRelations(userId: bigint, careerId: bigint) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario inexistente');

    const career = await this.prisma.careers.findUnique({ where: { id: careerId } });
    if (!career) throw new NotFoundException('Carrera inexistente');
  }

  async create(dto: CreateFavoriteDto) {
    const userId = BigInt(dto.user_id);
    const careerId = BigInt(dto.career_id);
    await this.checkRelations(userId, careerId);

    const duplicate = await this.prisma.favorites.findFirst({
      where: { user_id: userId, career_id: careerId },
    });
    if (duplicate) throw new ConflictException('Favorito duplicado');

    try {
      const favorite = await this.prisma.favorites.create({
        data: { user_id: userId, career_id: careerId },
      });
      return this.serialize(favorite);
    } catch (error) {
      if (this.errorCode(error) === 'P2002') throw new ConflictException('Favorito duplicado');
      if (this.errorCode(error) === 'P2003') throw new BadRequestException('Usuario o carrera inválidos');
      throw error;
    }
  }

  async findAll() {
    const favorites = await this.prisma.favorites.findMany({ orderBy: { id: 'asc' } });
    return favorites.map((favorite) => this.serialize(favorite));
  }

  async findOne(id: string) {
    const favorite = await this.prisma.favorites.findUnique({ where: { id: this.parseId(id) } });
    if (!favorite) throw new NotFoundException('Favorito inexistente');
    return this.serialize(favorite);
  }

  async update(id: string, dto: UpdateFavoriteDto) {
    const favoriteId = this.parseId(id);
    const existing = await this.prisma.favorites.findUnique({ where: { id: favoriteId } });
    if (!existing) throw new NotFoundException('Favorito inexistente');

    const userId = dto.user_id !== undefined ? BigInt(dto.user_id) : existing.user_id;
    const careerId = dto.career_id !== undefined ? BigInt(dto.career_id) : existing.career_id;
    if (dto.user_id !== undefined || dto.career_id !== undefined) {
      await this.checkRelations(userId, careerId);
    }

    const duplicate = await this.prisma.favorites.findFirst({
      where: { user_id: userId, career_id: careerId, id: { not: favoriteId } },
    });
    if (duplicate) throw new ConflictException('Favorito duplicado');

    try {
      const favorite = await this.prisma.favorites.update({
        where: { id: favoriteId },
        data: {
          ...(dto.user_id !== undefined ? { user_id: userId } : {}),
          ...(dto.career_id !== undefined ? { career_id: careerId } : {}),
        },
      });
      return this.serialize(favorite);
    } catch (error) {
      if (this.errorCode(error) === 'P2002') throw new ConflictException('Favorito duplicado');
      if (this.errorCode(error) === 'P2003') throw new BadRequestException('Usuario o carrera inválidos');
      if (this.errorCode(error) === 'P2025') throw new NotFoundException('Favorito inexistente');
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const favorite = await this.prisma.favorites.delete({ where: { id: this.parseId(id) } });
      return { mensaje: 'Favorito eliminado', favorito: this.serialize(favorite) };
    } catch (error) {
      if (this.errorCode(error) === 'P2025') throw new NotFoundException('Favorito inexistente');
      throw error;
    }
  }
}
