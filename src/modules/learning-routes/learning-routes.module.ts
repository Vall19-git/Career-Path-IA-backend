import { Module } from '@nestjs/common';
import { LearningRoutesService } from './learning-routes.service.js';
import { LearningRoutesController } from './learning-routes.controller.js';

@Module({
  controllers: [LearningRoutesController],
  providers: [LearningRoutesService],
})
export class LearningRoutesModule {}
