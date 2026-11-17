import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateRecommendationDto } from './dto/create-recommendation.dto.js';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto.js';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  private serializeRecommendation(recommendation: {
    id: bigint;
    user_id: bigint;
    career_id: bigint;
    puntaje: { toNumber(): number };
    resultado: string;
  }) {
    return {
      id: recommendation.id.toString(),
      user_id: recommendation.user_id.toString(),
      career_id: recommendation.career_id.toString(),
      puntaje: recommendation.puntaje.toNumber(),
      resultado: recommendation.resultado,
    };
  }

  private async checkRelations(userId: bigint, careerId: bigint): Promise<void> {
    const [user, career] = await Promise.all([
      this.prisma.users.findUnique({ where: { id: userId }, select: { id: true } }),
      this.prisma.careers.findUnique({ where: { id: careerId }, select: { id: true } }),
    ]);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (!career) {
      throw new NotFoundException('Carrera no encontrada');
    }
  }

  private handlePrismaError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una recomendación para ese usuario y carrera');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('Usuario o carrera no encontrados');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Recomendación no encontrada');
      }
    }
    throw error;
  }

  async create(createRecommendationDto: CreateRecommendationDto) {
    const userId = BigInt(createRecommendationDto.user_id);
    const careerId = BigInt(createRecommendationDto.career_id);
    await this.checkRelations(userId, careerId);

    try {
      const recommendation = await this.prisma.recommendations.create({
        data: {
          user_id: userId,
          career_id: careerId,
          puntaje: String(createRecommendationDto.puntaje),
          resultado: createRecommendationDto.resultado,
        },
      });
      return this.serializeRecommendation(recommendation);
    } catch (error: unknown) {
      return this.handlePrismaError(error);
    }
  }

  async findAll() {
    const recommendations = await this.prisma.recommendations.findMany({
      orderBy: { id: 'asc' },
    });
    return recommendations.map((recommendation) => this.serializeRecommendation(recommendation));
  }

  async findOne(id: bigint) {
    const recommendation = await this.prisma.recommendations.findUnique({ where: { id } });
    if (!recommendation) {
      throw new NotFoundException('Recomendación no encontrada');
    }
    return this.serializeRecommendation(recommendation);
  }

  async update(id: bigint, updateRecommendationDto: UpdateRecommendationDto) {
    const existing = await this.prisma.recommendations.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Recomendación no encontrada');
    }

    const userId = updateRecommendationDto.user_id === undefined
      ? existing.user_id
      : BigInt(updateRecommendationDto.user_id);
    const careerId = updateRecommendationDto.career_id === undefined
      ? existing.career_id
      : BigInt(updateRecommendationDto.career_id);
    await this.checkRelations(userId, careerId);

    try {
      const recommendation = await this.prisma.recommendations.update({
        where: { id },
        data: {
          ...(updateRecommendationDto.user_id !== undefined && { user_id: userId }),
          ...(updateRecommendationDto.career_id !== undefined && { career_id: careerId }),
          ...(updateRecommendationDto.puntaje !== undefined && {
            puntaje: String(updateRecommendationDto.puntaje),
          }),
          ...(updateRecommendationDto.resultado !== undefined && {
            resultado: updateRecommendationDto.resultado,
          }),
        },
      });
      return this.serializeRecommendation(recommendation);
    } catch (error: unknown) {
      return this.handlePrismaError(error);
    }
  }

  async remove(id: bigint) {
    try {
      const recommendation = await this.prisma.recommendations.delete({ where: { id } });
      return this.serializeRecommendation(recommendation);
    } catch (error: unknown) {
      return this.handlePrismaError(error);
    }
  }
}
