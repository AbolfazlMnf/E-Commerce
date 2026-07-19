import { removeItemFromCartDto } from './../dtos/remove-item.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../schemas/cart.schema';
import { Model } from 'mongoose';
import { CartItem } from '../schemas/cart-item.schema';
import { NewCartDto } from '../dtos/newcart.dto';
import { NewCartItemDto } from '../dtos/newCartItem.dto';
import { EditCartItemDto } from '../dtos/edit-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItem>,
  ) {}

  async createNewCart(body: NewCartDto, user: string) {
    const newCart = new this.cartModel({ user });
    await newCart.save();
    await this.createNewCartItem({
      product: body.product,
      cart: newCart._id.toString(),
    });
    return this.getCartDetail(newCart._id.toString());
  }

  async createNewCartItem(body: NewCartItemDto) {
    const newCartItem = new this.cartItemModel(body);
    await newCartItem.save();
    return newCartItem;
  }
  async findCart(id: string) {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) {
      throw new NotFoundException(`cart not found`);
    }
    return cart;
  }
  async findCartItems(id: string) {
    const cartItem = await this.cartItemModel
      .find({ cart: id })
      .sort({ createdAt: -1 })
      .populate(`product`)
      .exec();
    return cartItem;
  }
  async getCartDetail(id: string) {
    const cart = await this.findCart(id);
    const cartItems = await this.findCartItems(id);
    const prices = this.getPrices(id);
    return { cart, cartItems, prices };
  }
  async getPrices(id: string) {
    const items = await this.findCartItems(id);

    let totalPriceWithoutDiscount = 0;
    let totalPriceWithDiscount = 0;
    for (const item of items) {
      const price = item?.product?.price;
      const discount = item?.product?.discount;
      const quantity = item?.quantity;
      const discountedPrice = price - price * (discount / 100);
      const itemPriceWithDiscount = discountedPrice * quantity;
      const itemPriceWithoutDiscount = price * quantity;
      totalPriceWithDiscount += itemPriceWithDiscount;
      totalPriceWithoutDiscount += itemPriceWithoutDiscount;
    }
    return { totalPriceWithDiscount, totalPriceWithoutDiscount };
  }
  async findCartItem(id: string) {
    const cartItem = await this.cartItemModel.findById(id).exec();
    if (!cartItem) {
      throw new NotFoundException();
    }
    return cartItem;
  }
  async editCartItem(body: EditCartItemDto) {
    const cartItem = await this.findCartItem(body.cartItem);
    cartItem.quantity = body.quantity;
    await cartItem.save();
    return cartItem;
  }

  async addItemToCart(id: string, body: NewCartDto) {
    const items = await this.findCartItems(id);
    const oldItem = items.find(
      (item) => item.product._id.toString() === body.product,
    );
    if (oldItem?._id) {
      await this.editCartItem({
        cartItem: oldItem._id.toString(),
        quantity: oldItem?.quantity + 1,
      });
    } else {
      const cart = await this.findCart(id);
      await this.createNewCartItem({
        cart: cart._id.toString(),
        product: body.product,
      });
    }
    return this.getCartDetail(id);
  }
  async removeCartItem(id: string) {
    const item = await this.findCartItem(id);
    await item.deleteOne();
    return item;
  }
  async removeCart(id: string) {
    const cart = await this.findCart(id);
    await cart.deleteOne();
    return cart;
  }
  async removeItemFromCart(id: string, body: removeItemFromCartDto) {
    await this.removeCartItem(body.cartItem);
    const items = await this.findCartItems(id);
    if (items.length) {
      return this.getCartDetail(id);
    } else {
      await this.removeCart(id);
      return { message: `cart deleted` };
    }
  }
  async deleteCartAndItems(id: string) {
    const items = await this.findCartItems(id);
    for (const item of items) {
      await this.removeCartItem(item._id.toString());
    }
    await this.removeCart(id);
  }
}
