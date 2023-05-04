import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TaskDocument = Task & Document;

@Schema({ collection: 'task', timestamps: true })
export class Task {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  type: number;
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isHide: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
