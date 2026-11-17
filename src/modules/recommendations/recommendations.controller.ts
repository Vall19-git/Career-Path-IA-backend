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
import { RecommendationsService } from './recommendations.service.js';
import { CreateRecommendationDto } from './dto/create-recommendation.dto.js';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto.js';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  private parseId(id: string): bigint {
    if (!/^[1-9]\d{0,18}$/.test(id) || BigInt(id) > 9223372036854775807n) {
      throw new BadRequestException('El ID debe ser un entero positivo válido');
    }
    return BigInt(id);
  }

  @Post()
  create(@Body() createRecommendationDto: CreateRecommendationDto) {
    return this.recommendationsService.create(createRecommendationDto);
  }

  @Get()
  findAll() {
    return this.recommendationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recommendationsService.findOne(this.parseId(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecommendationDto: UpdateRecommendationDto) {
    return this.recommendationsService.update(this.parseId(id), updateRecommendationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recommendationsService.remove(this.parseId(id));
  }
}
