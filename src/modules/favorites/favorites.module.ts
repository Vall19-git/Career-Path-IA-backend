import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { FavoritesService } from './favorites.service.js';
import { FavoritesController } from './favorites.controller.js';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService],
})
export class FavoritesModule {}
