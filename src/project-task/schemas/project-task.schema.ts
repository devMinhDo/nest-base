import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProjectTaskDocument = ProjectTask & Document;

@Schema({ collection: 'projectTask', timestamps: true })
export class ProjectTask {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  projectId: number;
  @Prop({ required: true })
  taskId: number;
  @Prop({ default: false })
  billable: boolean;
}

export const ProjectTaskSchema = SchemaFactory.createForClass(ProjectTask);
