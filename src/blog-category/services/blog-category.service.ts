import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogCategory } from '../Schema/blogCategory.Schema';
import { Model } from 'mongoose';
import { GeneralQueryDto, Order } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';
import { getSortOption } from 'src/shared/utils/sort';
import { BlogCategoryDto, UpdateCategoryDto } from '../dtos/blogCategory.dto';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectModel(BlogCategory.name)
    private readonly blogCategoryModel: Model<BlogCategory>,
  ) {}
  async findAll(query: GeneralQueryDto) {
    const { page = 1, limit = 5, sort, order = Order.Desc, title } = query;
    const orderOption = getOrderOption(order);
    const sortOption = getSortOption(orderOption, sort);
    const filter = title ? { title: { $regex: title, $options: `i` } } : {};
    const [categories, count] = await Promise.all([
      this.blogCategoryModel
        .find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.blogCategoryModel.countDocuments(filter).exec(),
    ]);
    return { categories, count, page, limit };
  }
  async findOne(id: string) {
    const category = await this.blogCategoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }
  async create(body: BlogCategoryDto) {
    const newCategory = new this.blogCategoryModel(body);
    await newCategory.save();
    return {
      message: `Category created successfully`,
      category: newCategory,
    };
  }
  async update(id: string, body: UpdateCategoryDto) {
    const editedCategory = await this.blogCategoryModel
      .findByIdAndUpdate(id, body, { returnDocument: `after` })
      .exec();
    if (!editedCategory) {
      throw new BadRequestException();
    }
    return editedCategory;
  }
  async delete(id: string) {
    const deletedCategory = await this.blogCategoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCategory) {
      throw new NotFoundException();
    }
    return { message: `Category deleted successfully` };
  }
}
