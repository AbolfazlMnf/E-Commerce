import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { AddressQueryDto } from '../dtos/address-query.dto';
import { UpdateAddressDto } from '../dtos/update-address.dto';
import { AddressDto } from '../dtos/address.dto';
import { Address } from '../Schema/address.schema';
import { sortOrder } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';
import { getSortOption } from 'src/shared/utils/sort';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
  ) {}

  async findAll(
    queryParams: AddressQueryDto,
    user: string,
    selectObject: any = { __v: 0 },
  ) {
    const { limit = 10, page = 1, order = sortOrder.Desc } = queryParams;

    const query: any = {};
    query.user = user;

    const orderOption = getOrderOption(order);
    const sortObject = getSortOption(orderOption, queryParams?.sort);

    const addresses = await this.addressModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortObject)
      .select(selectObject)
      .exec();

    const count = await this.addressModel.countDocuments(query);

    return { count, addresses };
  }

  async findOne(id: string, selectObject: any = { __v: 0 }) {
    const address = await this.addressModel
      .findOne({ _id: id })
      .select(selectObject)
      .exec();

    if (address) {
      return address;
    } else {
      throw new NotFoundException();
    }
  }

  async create(body: AddressDto, user: string) {
    const newAddress = new this.addressModel({ ...body, user: user });
    await newAddress.save();
    return newAddress;
  }

  async update(id: string, body: UpdateAddressDto) {
    return await this.addressModel.findByIdAndUpdate(id, body, {
      returnDocument: `after`,
    });
  }

  async delete(id: string) {
    const address = await this.findOne(id);
    await address.deleteOne();
    return address;
  }
}
