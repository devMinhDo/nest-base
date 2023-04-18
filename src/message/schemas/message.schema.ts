import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Types } from 'mongoose';
import { TypeMessageConstant } from '../constant/type-message.constant';

export type MessageDocument = Message & Document;

@Schema({ collection: 'conversation', timestamps: true })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  senderId: User;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  recipientId: User;

  @Prop({ required: true, enum: TypeMessageConstant })
  messageType: TypeMessageConstant;

  @Prop({ required: true })
  content: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Message);
