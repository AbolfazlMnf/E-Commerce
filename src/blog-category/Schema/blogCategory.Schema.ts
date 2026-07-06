import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class BlogCategory extends Document {
  @Prop()
  title!: string;

  @Prop()
  content?: string;
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);
