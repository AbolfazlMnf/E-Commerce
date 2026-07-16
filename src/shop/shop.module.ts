import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartItem, CartItemSchema } from './schemas/cart-item.schema';
import { Shipping, shippingSchema } from './schemas/shipping.schema';
import { ShippingController } from './controllers/shipping.controller';
import { ShippingService } from './services/shipping.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },
      {
        name: CartItem.name,
        schema: CartItemSchema,
      },
      {
        name: Shipping.name,
        schema: shippingSchema,
      },
    ]),
  ],
  controllers: [CartController, ShippingController],
  providers: [CartService, ShippingService],
})
export class ShopModule {}
