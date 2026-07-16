import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Shipping extends Document {
  @Prop()
  title!: string;

  @Prop()
  price!: number;

  @Prop({ required: false, default: null })
  freeShippingThreshold?: number;
}

export const shippingSchema = SchemaFactory.createForClass(Shipping);
