import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LearningRoutesService } from './learning-routes.service.js';
import { CreateLearningRouteDto } from './dto/create-learning-route.dto.js';
import { UpdateLearningRouteDto } from './dto/update-learning-route.dto.js';

@Controller('learning-routes')
export class LearningRoutesController {
  constructor(private readonly learningRoutesService: LearningRoutesService) {}

  private parseId(id: string): bigint {
    if (!/^[1-9]\d{0,18}$/.test(id) || BigInt(id) > 9223372036854775807n) {
      throw new BadRequestException('El ID debe ser un entero positivo válido');
    }
    return BigInt(id);
  }

  @Post()
  create(@Body() createLearningRouteDto: CreateLearningRouteDto) {
    return this.learningRoutesService.create(createLearningRouteDto);
  }

  @Get()
  findAll() {
    return this.learningRoutesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningRoutesService.findOne(this.parseId(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningRouteDto: UpdateLearningRouteDto) {
    return this.learningRoutesService.update(this.parseId(id), updateLearningRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningRoutesService.remove(this.parseId(id));
  }
}
