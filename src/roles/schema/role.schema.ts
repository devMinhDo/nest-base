import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoleDocument = Role & Document;

@Schema({ collection: 'role', timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
