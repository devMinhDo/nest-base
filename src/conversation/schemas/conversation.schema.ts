import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Types } from 'mongoose';
import { Message } from '../../message/schemas/message.schema';

export type ConversationDocument = Conversation & Document;

@Schema({ collection: 'conversation', timestamps: true })
export class Conversation {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: User.name, default: [] })
  members: User[];

  @Prop({ type: [Types.ObjectId], ref: Message.name, default: [] })
  messages: Message[];

  @Prop({ type: Types.ObjectId, ref: Message.name, default: null })
  lastMessage: Message;

  @Prop({ default: 0 })
  unreadCount: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
