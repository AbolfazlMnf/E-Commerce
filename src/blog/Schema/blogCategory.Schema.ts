import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class BlogCategory extends Document {
  @Prop()
  title!: string;

  @Prop()
  content?: string;

  @Prop({
    required: false,
    type: String,
  })
  image?: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  url!: string;
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);
