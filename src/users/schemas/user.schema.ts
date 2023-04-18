import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Role } from 'src/roles/schema/role.schema';
import { UserStatus } from '../constant/user-status.constant';

export type UserDocument = User & Document;

@Schema({ collection: 'user', timestamps: true })
export class User {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: null, hidden: true })
  password: string;

  @Prop({ enum: UserStatus, default: UserStatus.ENABLE })
  status: UserStatus;

  @Prop({ type: [Types.ObjectId], ref: Role.name, default: [], required: true })
  roles: Role[];

  @Prop({ default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
