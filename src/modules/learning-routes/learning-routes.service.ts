import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateLearningRouteDto } from './dto/create-learning-route.dto.js';
import { UpdateLearningRouteDto } from './dto/update-learning-route.dto.js';

@Injectable()
export class LearningRoutesService {
  constructor(private readonly prisma: PrismaService) {}

  private serializeLearningRoute(route: {
    id: bigint;
    user_id: bigint;
    career_id: bigint;
    estado: string;
    progreso: { toNumber(): number };
  }) {
    return {
      id: route.id.toString(),
      user_id: route.user_id.toString(),
      career_id: route.career_id.toString(),
      estado: route.estado,
      progreso: route.progreso.toNumber(),
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
        throw new ConflictException('Ya existe una ruta para ese usuario y carrera');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('Usuario o carrera no encontrados');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Ruta de aprendizaje no encontrada');
      }
    }
    throw error;
  }

  async create(createLearningRouteDto: CreateLearningRouteDto) {
    const userId = BigInt(createLearningRouteDto.user_id);
    const careerId = BigInt(createLearningRouteDto.career_id);
    await this.checkRelations(userId, careerId);

    try {
      const route = await this.prisma.learning_routes.create({
        data: {
          user_id: userId,
          career_id: careerId,
          estado: createLearningRouteDto.estado,
          progreso: String(createLearningRouteDto.progreso),
        },
      });
      return this.serializeLearningRoute(route);
    } catch (error: unknown) {
      return this.handlePrismaError(error);
    }
  }

  async findAll() {
    const routes = await this.prisma.learning_routes.findMany({
      orderBy: { id: 'asc' },
    });
    return routes.map((route) => this.serializeLearningRoute(route));
  }

  async findOne(id: bigint) {
    const route = await this.prisma.learning_routes.findUnique({ where: { id } });
    if (!route) {
      throw new NotFoundException('Ruta de aprendizaje no encontrada');
    }
    return this.serializeLearningRoute(route);
  }

  async update(id: bigint, updateLearningRouteDto: UpdateLearningRouteDto) {
    const existing = await this.prisma.learning_routes.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Ruta de aprendizaje no encontrada');
    }

    const userId = updateLearningRouteDto.user_id === undefined
      ? existing.user_id
      : BigInt(updateLearningRouteDto.user_id);
    const careerId = updateLearningRouteDto.career_id === undefined
      ? existing.career_id
      : BigInt(updateLearningRouteDto.career_id);

    if (updateLearningRouteDto.user_id !== undefined || updateLearningRouteDto.career_id !== undefined) {
      await this.checkRelations(userId, careerId);
    }

    try {
      const route = await this.prisma.learning_routes.update({
        where: { id },
        data: {
          ...(updateLearningRouteDto.user_id !== undefined && { user_id: userId }),
          ...(updateLearningRouteDto.career_id !== undefined && { career_id: careerId }),
          ...(updateLearningRouteDto.estado !== undefined && {
            estado: updateLearningRouteDto.estado,
          }),
          ...(updateLearningRouteDto.progreso !== undefined && {
            progreso: String(updateLearningRouteDto.progreso),
          }),
        },
      });
      return this.serializeLearningRoute(route);
    } catch (error: unknown) {
      return this.handlePrismaError(error);
    }
  }

  async remove(id: bigint) {
    try {
      const route = await this.prisma.learning_routes.delete({ where: { id } });
      return this.serializeLearningRoute(route);
    } catch (error: unknown) {
      return this.handlePrismaError(error);
    }
  }
}
