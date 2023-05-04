import { Module } from '@nestjs/common';
import { TimeKeepController } from './time-keep.controller';

@Module({
  imports: [],
  exports: [],
  controllers: [TimeKeepController],
  providers: [],
})
export class TimeKeepModule {}
