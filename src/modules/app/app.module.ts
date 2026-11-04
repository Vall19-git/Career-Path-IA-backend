import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';

import { ProfilesModule } from '../profiles/profiles.module.js';
import { FavoritesModule } from '../favorites/favorites.module.js';

import { CareersModule } from '../careers/careers.module.js';
import { RecommendationsModule } from '../recommendations/recommendations.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    UsersModule,

    ProfilesModule,
    FavoritesModule,

    CareersModule,
    RecommendationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}