import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningRoutesService } from './learning-routes.service.js';
import { CreateLearningRouteDto } from './dto/create-learning-route.dto.js';
import { UpdateLearningRouteDto } from './dto/update-learning-route.dto.js';

@Controller('learning-routes')
export class LearningRoutesController {
  constructor(private readonly learningRoutesService: LearningRoutesService) {}

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
    return this.learningRoutesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningRouteDto: UpdateLearningRouteDto) {
    return this.learningRoutesService.update(+id, updateLearningRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningRoutesService.remove(+id);
  }
}
