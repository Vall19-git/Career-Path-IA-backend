import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(value: string): bigint {
    if (!/^[1-9]\d*$/.test(value)) {
      throw new BadRequestException('ID inválido: debe ser un entero positivo');
    }
    return BigInt(value);
  }

  private serialize(profile: { id: bigint; user_id: bigint; intereses: string; habilidades: string }) {
    return { ...profile, id: profile.id.toString(), user_id: profile.user_id.toString() };
  }

  private errorCode(error: unknown): string | undefined {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      return String(error.code);
    }
    return undefined;
  }

  async create(dto: CreateProfileDto) {
    const userId = BigInt(dto.user_id);
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario inexistente');

    try {
      const profile = await this.prisma.profiles.create({
        data: { user_id: userId, intereses: dto.intereses, habilidades: dto.habilidades },
      });
      return this.serialize(profile);
    } catch (error) {
      if (this.errorCode(error) === 'P2002') throw new ConflictException('El usuario ya tiene un perfil');
      if (this.errorCode(error) === 'P2003') throw new BadRequestException('Usuario inválido');
      throw error;
    }
  }

  async findAll() {
    const profiles = await this.prisma.profiles.findMany({ orderBy: { id: 'asc' } });
    return profiles.map((profile) => this.serialize(profile));
  }

  async findOne(id: string) {
    const profile = await this.prisma.profiles.findUnique({ where: { id: this.parseId(id) } });
    if (!profile) throw new NotFoundException('Perfil inexistente');
    return this.serialize(profile);
  }

  async update(id: string, dto: UpdateProfileDto) {
    const profileId = this.parseId(id);
    const existing = await this.prisma.profiles.findUnique({ where: { id: profileId } });
    if (!existing) throw new NotFoundException('Perfil inexistente');

    const data: { user_id?: bigint; intereses?: string; habilidades?: string } = {};
    if (dto.user_id !== undefined) {
      const userId = BigInt(dto.user_id);
      const user = await this.prisma.users.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuario inexistente');
      data.user_id = userId;
    }
    if (dto.intereses !== undefined) data.intereses = dto.intereses;
    if (dto.habilidades !== undefined) data.habilidades = dto.habilidades;

    try {
      const profile = await this.prisma.profiles.update({ where: { id: profileId }, data });
      return this.serialize(profile);
    } catch (error) {
      if (this.errorCode(error) === 'P2002') throw new ConflictException('El usuario ya tiene un perfil');
      if (this.errorCode(error) === 'P2025') throw new NotFoundException('Perfil inexistente');
      if (this.errorCode(error) === 'P2003') throw new BadRequestException('Usuario inválido');
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const profile = await this.prisma.profiles.delete({ where: { id: this.parseId(id) } });
      return { mensaje: 'Perfil eliminado', perfil: this.serialize(profile) };
    } catch (error) {
      if (this.errorCode(error) === 'P2025') throw new NotFoundException('Perfil inexistente');
      throw error;
    }
  }
}
