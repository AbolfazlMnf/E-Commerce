import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class PublicImage extends Document {
  @Prop()
  image!: string;
}

export const PublicImageSchema = SchemaFactory.createForClass(PublicImage);
