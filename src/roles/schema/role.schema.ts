import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoleDocument = Role & Document;

@Schema({ collection: 'role', timestamps: true })
export class Role {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  displayName: string;

  @Prop({ default: '' })
  normalizedName: string;

  @Prop({ default: '' })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
