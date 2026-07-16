import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { Cart } from './cart.schema';

@Schema({ timestamps: true, versionKey: false })
export class CartItem extends Document {
  @Prop({
    required: true,
    ref: Product.name,
    type: Types.ObjectId,
  })
  product!: Product;

  @Prop({ default: 1 })
  quantity!: number;

  @Prop({
    required: true,
    ref: Cart.name,
    type: Types.ObjectId,
  })
  cart!: Cart;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
