import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/Schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Cart extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user!: User;
}
export const CartSchema = SchemaFactory.createForClass(Cart);
