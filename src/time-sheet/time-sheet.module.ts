import { Module } from '@nestjs/common';
import { TimeSheetService } from './time-sheet.service';
import { TimeSheetController } from './time-sheet.controller';
import { MyTimeSheetModule } from '../my-time-sheet/my-time-sheet.module';

@Module({
  imports: [MyTimeSheetModule],
  exports: [TimeSheetService],
  controllers: [TimeSheetController],
  providers: [TimeSheetService],
})
export class TimeSheetModule {}
