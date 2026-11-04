import { Injectable } from '@nestjs/common';
import { CreateLearningRouteDto } from './dto/create-learning-route.dto.js';
import { UpdateLearningRouteDto } from './dto/update-learning-route.dto.js';

@Injectable()
export class LearningRoutesService {
  create(_createLearningRouteDto: CreateLearningRouteDto) {
    return 'This action adds a new learningRoute';
  }

  findAll() {
    return `This action returns all learningRoutes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningRoute`;
  }

  update(id: number, _updateLearningRouteDto: UpdateLearningRouteDto) {
    return `This action updates a #${id} learningRoute`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningRoute`;
  }
}
