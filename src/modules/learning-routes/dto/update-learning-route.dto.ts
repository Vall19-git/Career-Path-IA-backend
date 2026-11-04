import { PartialType } from '@nestjs/mapped-types';
import { CreateLearningRouteDto } from './create-learning-route.dto.js';

export class UpdateLearningRouteDto extends PartialType(CreateLearningRouteDto) {}
