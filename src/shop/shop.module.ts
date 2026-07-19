import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartItem, CartItemSchema } from './schemas/cart-item.schema';
import { Shipping, shippingSchema } from './schemas/shipping.schema';
import { ShippingController } from './controllers/shipping.controller';
import { ShippingService } from './services/shipping.service';
import { SiteOrderController } from './controllers/site-order.controller';
import { OrderService } from './services/order.service';
import { Order, orderSchema } from './schemas/order.schema';
import { OrderItem, orderItemSchema } from './schemas/order-item.schema';
import { AddressService } from 'src/user/services/address.service';
import { Address, addressSchema } from 'src/user/Schema/address.schema';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    ProductModule,
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
      {
        name: Order.name,
        schema: orderSchema,
      },
      {
        name: OrderItem.name,
        schema: orderItemSchema,
      },
      {
        name: Address.name,
        schema: addressSchema,
      },
    ]),
  ],
  controllers: [CartController, ShippingController, SiteOrderController],
  providers: [CartService, ShippingService, OrderService, AddressService],
})
export class ShopModule {}
