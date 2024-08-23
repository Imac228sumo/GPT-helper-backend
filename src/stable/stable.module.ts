import { Module } from '@nestjs/common';
import { StableService } from './stable.service';
import { StableController } from './stable.controller';

@Module({
  controllers: [StableController],
  providers: [StableService],
})
export class StableModule {}
