import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { inventoryRecord } from '../schemas/inventory-record.schema';
import { Model } from 'mongoose';
import { InventoryRecordDto } from '../dtos/inventory-record.dto';
import { InventoryQueryDto } from '../dtos/inventory-record.query.dto';
import { getOrderOption } from 'src/shared/utils/order';
import { getSortOption } from 'src/shared/utils/sort';
import { sortOrder } from 'src/shared/dtos/query.dto';

@Injectable()
export class InventoryRecordService {
  constructor(
    @InjectModel(inventoryRecord.name)
    private readonly inventoryRecordModel: Model<inventoryRecord>,
  ) {}

  async createInventory(body: InventoryRecordDto) {
    const newBody = new this.inventoryRecordModel(body);
    await newBody.save();
    return newBody;
  }
  async findAll(query: InventoryQueryDto) {
    const {
      page = 1,
      limit = 5,
      product,
      sort,
      order = sortOrder.Desc,
    } = query;

    let filter: any = {};
    if (product) {
      filter.product = { product };
    }
    const orderOption = getOrderOption(order);
    const sortOption = getSortOption(orderOption, sort);
    const [inventory, count] = await Promise.all([
      this.inventoryRecordModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption)
        .exec(),
      this.inventoryRecordModel.countDocuments(filter).exec(),
    ]);
    return { inventory, count, page, limit };
  }
}
