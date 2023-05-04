import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TimeSheetStatus } from '../constant/time-sheet-status.constant';
import { TypeOfWork } from '../constant/type-of-work.constant';
export type TimeSheetDocument = TimeSheet & Document;

@Schema({ collection: 'timeSheet', timestamps: true })
export class TimeSheet {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true, enum: TimeSheetStatus })
  status: TimeSheetStatus;

  @Prop({ default: 0 })
  workingTime: number;

  @Prop({ default: new Date() })
  dateAt: Date;

  @Prop({ default: 0 })
  projectTaskId: number;

  @Prop({ default: 0 })
  userId: number;

  @Prop({ default: '' })
  note: string;

  @Prop({ default: 0 })
  targetUserWorkingTime: number;

  @Prop({ enum: TypeOfWork })
  typeOfWork: TypeOfWork;

  @Prop({ default: false })
  isCharged: boolean;

  @Prop({ default: 0 })
  projectTargetUserId: number;
}

export const TimeSheetSchema = SchemaFactory.createForClass(TimeSheet);
