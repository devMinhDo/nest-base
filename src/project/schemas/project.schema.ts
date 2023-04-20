import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectTypeEnum } from '../enum/project-type.enum';
import { ProjectStatus } from '../enum/project-status.enum';
export type ProjectDocument = Project & Document;

@Schema({ collection: 'project', timestamps: true })
export class Project {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  name: string;
  @Prop({ default: '' })
  code: string;
  @Prop({ enum: ProjectStatus, required: true })
  status: string;
  @Prop({ default: new Date() })
  timeStart: Date;
  @Prop({ default: new Date() })
  timeEnd: Date;
  @Prop({ default: '' })
  note: string;
  @Prop({ enum: ProjectTypeEnum, required: true })
  projectType: string;

  @Prop({ required: true })
  customerId: number;
  @Prop({ required: true })
  isAllUserBelongTo: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
