import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../Schema/blog.schema';
import { Model } from 'mongoose';
import { BlogDto } from '../dtos/blog.dto';
import { GeneralQueryDto, Order } from 'src/shared/dtos/query.dto';
import { getSortOption } from 'src/shared/utils/sort';
import { getOrderOption } from 'src/shared/utils/order';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { BlogCategory } from 'src/blog-category/Schema/blogCategory.Schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(BlogCategory.name)
    private readonly categoryModel: Model<BlogCategory>,
  ) {}
  async findAll(queries: GeneralQueryDto) {
    const { page = 1, limit = 5, order = Order.Desc, title, sort } = queries;
    const filter = title ? { title: { $regex: title, $options: `i` } } : {};
    const orderOption = getOrderOption(order);
    const sortOption = getSortOption(orderOption, sort);
    const [blogs, count] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(`category`)
        .exec(),
      this.blogModel.countDocuments(filter).exec(),
    ]);
    return { blogs, count, page };
  }
  async findOne(id: string) {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException(`blog NotFound`);
    }
    return { blog };
  }
  async create(body: BlogDto) {
    const category = await this.categoryModel.findById(body.category).exec();
    if (!category) {
      throw new NotFoundException(`category Not found `);
    }
    const newBlog = new this.blogModel(body);
    await newBlog.save();
    return {
      message: 'Blog created successfully',
      blog: newBlog,
    };
  }
  async update(id, body: UpdateBlogDto) {
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, body, {
        returnDocument: `after`,
      })
      .exec();
    if (!updatedBlog) {
      throw new NotFoundException();
    }
    return updatedBlog;
  }
  async delete(id: string) {
    const deletedBlog = await this.blogModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      throw new NotFoundException();
    }
    return { message: `Blog deleted` };
  }
}
