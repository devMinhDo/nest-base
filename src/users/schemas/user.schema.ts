import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Role } from 'src/roles/schema/role.schema';
import { UserStatus } from '../constant/user-status.constant';

export type UserDocument = User & Document;

@Schema({ collection: 'user', timestamps: true })
export class User {
  @Prop({ required: true })
  id: number;

  @Prop({ default: '' })
  userName: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  surname: string;

  @Prop({ required: true, index: true, unique: true })
  emailAddress: string;

  @Prop({ required: true, hidden: true })
  password: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ enum: UserStatus, default: UserStatus.ENABLE })
  status: UserStatus;

  @Prop({ type: [Types.ObjectId], ref: Role.name, default: [], required: true })
  roleNames: Role[];

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: 0 })
  type: number;

  @Prop({ default: '' })
  jobTitle: string;

  @Prop({ default: 0 })
  level: number;

  @Prop({ default: '' })
  registerWorkDay: string;

  @Prop({ default: 0 })
  allowedLeaveDay: number;

  @Prop({ default: new Date() })
  startDateAt: Date;

  @Prop({ default: new Date() })
  salary: Date;

  @Prop({ default: new Date() })
  salaryAt: Date;

  @Prop({ default: '' })
  userCode: string;

  @Prop({ default: 0 })
  managerId: number;

  @Prop({ default: 0 })
  sex: number;

  @Prop({ default: '' })
  morningWorking: string;

  @Prop({ default: '' })
  morningStartAt: string;

  @Prop({ default: '' })
  morningEndAt: string;

  @Prop({ default: '' })
  afternoonWorking: string;

  @Prop({ default: '' })
  afternoonStartAt: string;

  @Prop({ default: '' })
  afternoonEndAt: string;

  @Prop({ default: '' })
  isWorkingTimeDefault: string;

  @Prop({ default: 0 })
  branchId: number;

  @Prop({ default: '' })
  branchCode: string;

  @Prop({ default: '' })
  avatarPath: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
