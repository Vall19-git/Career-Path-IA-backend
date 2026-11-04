import { Injectable } from '@nestjs/common';
import { CreateVocationalTestDto } from './dto/create-vocational-test.dto.js';
import { UpdateVocationalTestDto } from './dto/update-vocational-test.dto.js';

@Injectable()
export class VocationalTestsService {
  create(_createVocationalTestDto: CreateVocationalTestDto) {
    return 'This action adds a new vocationalTest';
  }

  findAll() {
    return `This action returns all vocationalTests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocationalTest`;
  }

  update(id: number, _updateVocationalTestDto: UpdateVocationalTestDto) {
    return `This action updates a #${id} vocationalTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocationalTest`;
  }
}
