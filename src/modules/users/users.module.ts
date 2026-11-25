import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { CurrentUserGuard } from './current-user.guard.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CurrentUserGuard],
})
export class UsersModule {}
