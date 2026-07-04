import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Blog extends Document {
  @Prop()
  title!: string;

  @Prop()
  content!: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
