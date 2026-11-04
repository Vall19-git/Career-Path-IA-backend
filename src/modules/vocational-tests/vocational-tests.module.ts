import { Module } from '@nestjs/common';
import { VocationalTestsService } from './vocational-tests.service.js';
import { VocationalTestsController } from './vocational-tests.controller.js';

@Module({
  controllers: [VocationalTestsController],
  providers: [VocationalTestsService],
})
export class VocationalTestsModule {}
