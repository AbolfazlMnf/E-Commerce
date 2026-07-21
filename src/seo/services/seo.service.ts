import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seo } from '../schemas/seo.schema';
import { Model } from 'mongoose';
import { SeoQueryDto } from '../dtos/seo.query';
import { sortOrder } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';
import { getSeoSortOption, getSortOption } from 'src/shared/utils/sort';
import { SeoDto, UpdateSeoDto } from '../dtos/seo.dto';

@Injectable()
export class SeoService {
  constructor(@InjectModel(Seo.name) private readonly seoModel: Model<Seo>) {}
  async findAll(query: SeoQueryDto) {
    const {
      sort,
      order = sortOrder.Desc,
      limit = 5,
      page = 1,
      seoTitle,
    } = query;
    const orderOption = getOrderOption(order);
    const sortOption = getSeoSortOption(orderOption, sort);

    let filter: any = {};

    if (seoTitle) {
      filter.seoTitle = { $regex: seoTitle, $options: `i` };
    }

    const [allSeo, count] = await Promise.all([
      this.seoModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption)
        .exec(),
      this.seoModel.countDocuments(filter).exec(),
    ]);
    return { allSeo, count, page, limit };
  }
  async findOne(id: string) {
    const seoItem = await this.seoModel.findById(id).exec();
    if (!seoItem) {
      throw new NotFoundException(`seo item not found`);
    }
    return seoItem;
  }
  async findOneWithUrl(url: string) {
    const seoItem = await this.seoModel.findOne({ url }).exec();
    if (!seoItem) {
      throw new NotFoundException(`seo item not found`);
    }
    return seoItem;
  }
  async create(body: SeoDto) {
    const newSeo = new this.seoModel(body);
    await newSeo.save();
    return { message: `seo item created` };
  }
  async update(id: string, body: UpdateSeoDto) {
    const updatedSeo = await this.seoModel
      .findByIdAndUpdate(id, body, { returnDocument: `after` })
      .exec();
    if (!updatedSeo) {
      throw new NotFoundException(`seo item not found`);
    }
  }
  async delete(id: string) {
    const deletedSeo = await this.seoModel.findByIdAndDelete(id).exec();
    if (!deletedSeo) {
      throw new NotFoundException(`seo item not found`);
    }
    return { message: `seo deleted` };
  }
}
