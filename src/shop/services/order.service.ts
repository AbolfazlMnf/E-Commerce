import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from '../schemas/order.schema';
import { Model } from 'mongoose';
import { OrderItem } from '../schemas/order-item.schema';
import { CartService } from './cart.service';
import { AddressService } from 'src/user/services/address.service';
import { ShippingService } from './shipping.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import axios from 'axios';
import { ProductService } from 'src/product/services/product.service';
import { EditedBy } from 'src/inventory/schemas/inventory-record.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItem>,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly shippingService: ShippingService,
    private readonly productService: ProductService,
  ) {}
  async createNewOrder(body: CreateOrderDto, user: string) {
    const { cartId, addressId, shippingId } = body;
    const cart = await this.cartService.getCartDetail(cartId);
    const shipping = await this.shippingService.findOne(shippingId);
    const address = await this.addressService.findOne(addressId);

    const shippingPrice =
      (await cart.prices).totalPriceWithDiscount <
      shipping?.freeShippingThreshold
        ? shipping.price
        : 0;

    const order = new this.orderModel({
      address: addressId,
      shipping: shippingId,
      cart: cartId,
      user,
      status: OrderStatus.Paying,
      totalWithDiscount: (await cart.prices).totalPriceWithDiscount,
      totalWithoutDiscount: (await cart.prices).totalPriceWithoutDiscount,
      shippingPrice: shippingPrice,
      finalPrice: (await cart.prices).totalPriceWithDiscount + shippingPrice,
    });
    const bankResponse = await this.createPaymentRequest(order?.finalPrice);
    if (bankResponse?.code === 100) {
      order.refId = bankResponse?.authority;
      for (const item of cart.cartItems) {
        const price = item?.product?.price;
        const discount = item?.product?.discount;
        const quantity = item?.quantity;

        const discountedPrice = price - price * (discount / 100);
        const itemPriceWithDiscount = discountedPrice * quantity;
        const itemPriceWithoutDiscount = price * quantity;

        const orderItem = new this.orderItemModel({
          priceWithDiscount: itemPriceWithDiscount,
          priceWithoutDiscount: itemPriceWithoutDiscount,
          order: order._id.toString(),
          quantity: item.quantity,
          product: item.product,
        });
        await this.productService.removeStock(
          item.product._id.toString(),
          item.quantity,
          EditedBy.Order,
          order._id.toString(),
        );

        await orderItem.save();
      }

      await order.save();
      return {
        url: `${process.env.CALL_BACK_URL}?authority=${bankResponse?.authority} `,
      };
    } else {
      throw new BadRequestException(
        `something went wrong with payment gateway`,
      );
    }
  }

  async findOrderWithRefId(refId: string) {
    const order = await this.orderModel.findOne({ refId }).exec();
    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }
  async findOrder(id: string) {
    const order = await this.orderModel.findOne({ _id: id }).exec();
    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }
  async checkOrder(id: string) {
    const order = await this.findOrder(id);
    const response = await axios.post(process.env.BANK_VERIFY_URL ?? ``, {
      amount: order.finalPrice,
      merchant_id: process.env.MERCHANT_ID,
      authority: order.refId,
    });
    return response.data?.data;
  }

  async createPaymentRequest(finalPrice: number) {
    const bankData = {
      amount: finalPrice,
      description: `خرید از مجموعه e-commerce`,
      merchant_id: process.env.MERCHANT_ID,
      callback_url: process.env.SITE_URL,
    };
    const response = await axios.post(process.env.BANK_URL ?? ``, bankData);
    return response?.data?.data;
  }
}
