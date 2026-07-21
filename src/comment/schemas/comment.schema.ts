import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/Schema/user.schema';

export enum CommentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Denied = 'denied',
}

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: false, default: null })
  content!: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: User;

  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product!: Product;

  @Prop()
  status!: CommentStatus;
}

export const commentSchema = SchemaFactory.createForClass(Comment);
