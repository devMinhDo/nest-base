import { Module } from '@nestjs/common';
import { MyTimeSheetService } from './my-time-sheet.service';
import { MyTimeSheetController } from './my-time-sheet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSheet, TimeSheetSchema } from './schemas/time-sheet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimeSheet.name, schema: TimeSheetSchema },
    ]),
  ],
  exports: [MyTimeSheetService],
  controllers: [MyTimeSheetController],
  providers: [MyTimeSheetService],
})
export class MyTimeSheetModule {}
