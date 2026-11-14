import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateVocationalTestDto } from './dto/create-vocational-test.dto.js';
import { UpdateVocationalTestDto } from './dto/update-vocational-test.dto.js';

@Injectable()
export class VocationalTestsService {
  constructor(private readonly prisma: PrismaService) {}

  private serializeQuestion(question: {
    id: bigint;
    enunciado: string;
    categoria: string;
  }) {
    return {
      ...question,
      id: Number(question.id),
    };
  }

  async create(createVocationalTestDto: CreateVocationalTestDto) {
    const question = await this.prisma.test_questions.create({
      data: {
        enunciado: createVocationalTestDto.enunciado,
        categoria: createVocationalTestDto.categoria,
      },
    });

    return this.serializeQuestion(question);
  }

  async findAll() {
    const questions = await this.prisma.test_questions.findMany();

    return questions.map((question) => this.serializeQuestion(question));
  }

  async findOne(id: number) {
    const question = await this.prisma.test_questions.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!question) {
      return null;
    }

    return this.serializeQuestion(question);
  }

  async update(id: number, updateVocationalTestDto: UpdateVocationalTestDto) {
    const question = await this.prisma.test_questions.update({
      where: {
        id: BigInt(id),
      },
      data: updateVocationalTestDto,
    });

    return this.serializeQuestion(question);
  }

  async remove(id: number) {
    const question = await this.prisma.test_questions.delete({
      where: {
        id: BigInt(id),
      },
    });

    return this.serializeQuestion(question);
  }
}
