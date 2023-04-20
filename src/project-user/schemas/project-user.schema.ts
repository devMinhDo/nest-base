import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectUserTypeEnum } from '../enum/project-user-type.enum';
export type ProjectUserDocument = ProjectUser & Document;

@Schema({ collection: 'projectUser', timestamps: true })
export class ProjectUser {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ enum: ProjectUserTypeEnum, required: true })
  type: string;
}

export const ProjectUserSchema = SchemaFactory.createForClass(ProjectUser);
