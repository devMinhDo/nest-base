import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Message } from '../../message/schemas/message.schema';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ collection: 'ChatRoom', timestamps: true })
export class ChatRoom {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: User.name, default: [] })
  members: User[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: User;

  @Prop({ type: [Types.ObjectId], ref: Message.name, default: [] })
  messages: Message[];

  @Prop({ type: Types.ObjectId, ref: Message.name, default: null })
  lastMessage: Message;

  @Prop({ default: 0 })
  unreadCount: number;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
