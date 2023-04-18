import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ collection: 'conversation', timestamps: true })
export class Conversation {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  name: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
