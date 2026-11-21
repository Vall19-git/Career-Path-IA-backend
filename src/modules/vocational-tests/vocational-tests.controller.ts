import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { VocationalTestsService } from './vocational-tests.service.js';
import { CreateVocationalTestDto } from './dto/create-vocational-test.dto.js';
import { UpdateVocationalTestDto } from './dto/update-vocational-test.dto.js';

@Controller('vocational-tests')
export class VocationalTestsController {
  constructor(private readonly vocationalTestsService: VocationalTestsService) {}

  @Post()
  create(@Body() createVocationalTestDto: CreateVocationalTestDto) {
    return this.vocationalTestsService.create(createVocationalTestDto);
  }

  @Get()
  findAll() {
    return this.vocationalTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vocationalTestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocationalTestDto: UpdateVocationalTestDto,
  ) {
    return this.vocationalTestsService.update(id, updateVocationalTestDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vocationalTestsService.remove(id);
  }
}
