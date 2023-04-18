import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ collection: 'ChatRoom', timestamps: true })
export class ChatRoom {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  name: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
