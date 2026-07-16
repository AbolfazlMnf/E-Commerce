import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ShippingQueryDto } from '../dtos/shipping-query.dto';
import { Shipping } from '../schemas/shipping.schema';
import { ShippingDto } from '../dtos/shipping.dto';
import { Order } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';
import { getSortOption } from 'src/shared/utils/sort';
import { UpdateShippingDto } from '../dtos/update-shipping.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipping.name)
    private readonly shippingModel: Model<Shipping>,
  ) {}

  async findAll(queryParams: ShippingQueryDto, selectObject: any = { __v: 0 }) {
    const { limit = 10, page = 1, title, order = Order.Desc } = queryParams;

    const query: any = {};
    if (title) query.title = { $regex: title, $options: 'i' };

    const orderOption = getOrderOption(order);
    const sortObject = getSortOption(orderOption, queryParams?.sort);

    const shippings = await this.shippingModel
      .find(query)
      .skip(page - 1)
      .limit(limit)
      .sort(sortObject)
      .select(selectObject)
      .exec();

    const count = await this.shippingModel.countDocuments(query);

    return { count, shippings };
  }

  async findOne(id: string, selectObject: any = { __v: 0 }) {
    const shipping = await this.shippingModel
      .findOne({ _id: id })
      .select(selectObject)
      .exec();

    if (shipping) {
      return shipping;
    } else {
      throw new NotFoundException('یافت نشد');
    }
  }

  async create(body: ShippingDto) {
    const newShipping = new this.shippingModel(body);
    await newShipping.save();
    return newShipping;
  }

  async update(id: string, body: UpdateShippingDto) {
    return await this.shippingModel.findByIdAndUpdate(id, body, {
      new: true,
    });
  }

  async delete(id: string) {
    const shipping = await this.findOne(id);
    await shipping.deleteOne();
    return shipping;
  }
}
