import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Seo extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  url!: string;

  @Prop({
    required: true,
    type: String,
  })
  seoTitle!: string;
  @Prop({
    required: true,
    type: String,
  })
  seoDescription!: string;

  @Prop({
    required: false,
    default: null,
    type: String,
  })
  h1!: string | null;

  @Prop({
    default: null,
    required: false,
    type: String,
  })
  content?: string | null;
}

export const SeoSchema = SchemaFactory.createForClass(Seo);
