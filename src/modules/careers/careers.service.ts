import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCareerDto } from './dto/create-career.dto.js';
import { UpdateCareerDto } from './dto/update-career.dto.js';

@Injectable()
export class CareersService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): bigint {
    if (!/^[1-9]\d*$/.test(id)) {
      throw new BadRequestException('El ID debe ser un entero positivo');
    }

    const careerId = BigInt(id);
    if (careerId > 9223372036854775807n) {
      throw new BadRequestException('El ID está fuera del rango permitido');
    }
    return careerId;
  }

  private serializeCareer(career: {
    id: bigint;
    nombre: string;
    duracion: string;
    modalidad: string;
    descripcion: string;
  }) {
    // JSON no admite bigint; devolver el ID como string evita perder precisión.
    return { ...career, id: career.id.toString() };
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una carrera con ese nombre');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Carrera no encontrada');
      }
    }
    throw error;
  }

  async create(createCareerDto: CreateCareerDto) {
    try {
      const career = await this.prisma.careers.create({
        data: createCareerDto,
      });
      return this.serializeCareer(career);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll() {
    const careers = await this.prisma.careers.findMany({
      orderBy: { id: 'asc' },
    });
    return careers.map((career) => this.serializeCareer(career));
  }

  async findOne(id: string) {
    const career = await this.prisma.careers.findUnique({
      where: { id: this.parseId(id) },
    });
    if (!career) {
      throw new NotFoundException('Carrera no encontrada');
    }
    return this.serializeCareer(career);
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    const careerId = this.parseId(id);
    try {
      const career = await this.prisma.careers.update({
        where: { id: careerId },
        data: updateCareerDto,
      });
      return this.serializeCareer(career);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    const careerId = this.parseId(id);
    try {
      const career = await this.prisma.careers.delete({
        where: { id: careerId },
      });
      return this.serializeCareer(career);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
