import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogCategory } from '../Schema/blogCategory.Schema';
import { Model } from 'mongoose';
import { sortOrder } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';
import { getSortOption } from 'src/shared/utils/sort';
import { BlogCategoryDto, UpdateCategoryDto } from '../dtos/blogCategory.dto';
import { BlogQueryDto, Sort } from 'src/blog/dtos/blog.query.dto';
import { deleteImages, saveImage } from 'src/shared/utils/image';
import { BlogCategoryQueryDto } from '../dtos/blogCategory.query.dto';
import { RedisService } from 'src/redis/services/redis.service';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectModel(BlogCategory.name)
    private readonly blogCategoryModel: Model<BlogCategory>,
    private readonly redisService: RedisService,
  ) {}
  async findAll(query: BlogCategoryQueryDto, select?: Record<string, -1 | 1>) {
    const {
      page = 1,
      limit = 5,
      sort = Sort.CreatedAt,
      order = sortOrder.Desc,
      title,
      url,
      exclude,
    } = query;
    const orderOption = getOrderOption(order);
    const sortOption = getSortOption(orderOption, sort);
    const filter: any = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (url) {
      filter.url = { $regex: url, $options: 'i' };
    }
    if (exclude) {
      filter._id = { $nin: exclude };
    }
    const [categories, count] = await Promise.all([
      this.blogCategoryModel
        .find(filter, select)
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
  async findOneWithUrl(url: string) {
    const category = await this.blogCategoryModel.findOne({ url }).exec();
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
  async UploadImage(id: string, file: Express.Multer.File) {
    const category = await this.findOne(id);
    const imageUrl = await saveImage(file, `blog-category`);
    category.image = imageUrl;
    await category.save();
    return { message: `image saved successfully` };
  }
  async deleteImage(id: string) {
    const category = await this.findOne(id);
    if (!category.image) {
      throw new NotFoundException(`image not found`);
    }
    await deleteImages([category.image]);
    category.image = undefined;
    await category.save();
    return { message: `image deleted successfully` };
  }
}
