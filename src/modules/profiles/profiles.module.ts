import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProfilesService } from './profiles.service.js';
import { ProfilesController } from './profiles.controller.js';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, PrismaService],
})
export class ProfilesModule {}
