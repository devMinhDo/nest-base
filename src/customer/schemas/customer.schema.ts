import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ collection: 'customer', timestamps: true })
export class Customer {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  address: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
