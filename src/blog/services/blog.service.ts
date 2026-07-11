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
import { deleteImages, saveImages } from 'src/shared/utils/image';
import { DeleteFileDto } from 'src/shared/dtos/file.dto';
import { ObjectId } from 'mongodb';
import { BlogQueryDto, Sort } from '../dtos/blog.query.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(BlogCategory.name)
    private readonly categoryModel: Model<BlogCategory>,
  ) {}
  async findAll(queries: BlogQueryDto, select?: Record<string, -1 | 1>) {
    const {
      page = 1,
      limit = 5,
      order = Order.Desc,
      title,
      sort = Sort.CreatedAt,
      url,
    } = queries;
    const filter: any = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (url) {
      filter.url = { $regex: url, $options: 'i' };
    }
    const orderOption = getOrderOption(order);
    const sortOption = getSortOption(orderOption, sort);
    const [blogs, count] = await Promise.all([
      this.blogModel
        .find(filter, select)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate([
          {
            path: `category`,
            select: `title content`,
          },
          {
            path: `author`,
            select: `firstName lastName`,
          },
        ])
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
    return blog;
  }
  async create(body: BlogDto, user: string) {
    const category = await this.categoryModel.findById(body.category).exec();
    if (!category) {
      throw new NotFoundException(`category Not found `);
    }
    const newBlog = new this.blogModel({ ...body, author: user });
    await newBlog.save();
    await newBlog.populate([
      {
        path: `category`,
        select: `title content`,
      },
      {
        path: `author`,
        select: `firstName lastName`,
      },
    ]);

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
    const deletedBlog = await this.blogModel.findByIdAndDelete(id).exec();
    if (!deletedBlog) {
      throw new NotFoundException();
    }
    if (deletedBlog.images && deletedBlog.images?.length > 0) {
      await deleteImages(deletedBlog.images);
    }
    return { message: `Blog deleted` };
  }

  async uploadImages(id: string, files: Array<Express.Multer.File>) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    const imagesUrl = await saveImages(files, 'blog', 400, 500);
    blog.images = imagesUrl;
    await blog?.save();
    return {
      message: `${imagesUrl.length > 1 ? `images` : `image`} added successfully`,
    };
  }
  async deleteImage(id: string, body: DeleteFileDto) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog not found !`);
    }

    if (!blog.images?.length) {
      throw new NotFoundException(`no images found`);
    }

    const imagesToDelete = blog.images.filter((image) =>
      body.filePaths.includes(image),
    );
    await deleteImages(imagesToDelete);
    blog.images = blog.images.filter(
      (image) => !body.filePaths.includes(image),
    );
    await blog.save();
    return {
      message: `${body.filePaths.length > 1 ? `images` : `image`} deleted successfully`,
    };
  }
}
