import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BlogCategory } from 'src/blog-category/Schema/blogCategory.Schema';

@Schema({ timestamps: true, versionKey: false })
export class Blog extends Document {
  @Prop()
  title!: string;

  @Prop()
  content!: string;
  @Prop({
    type: Types.ObjectId,
    ref: BlogCategory.name,
    required: true,
  })
  category!: BlogCategory;

  @Prop({ required: false })
  images?: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
