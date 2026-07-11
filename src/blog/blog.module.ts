import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './Schema/blog.schema';
import {
  BlogCategory,
  BlogCategorySchema,
} from 'src/blog-category/Schema/blogCategory.Schema';
import { SiteBlogController } from './controllers/site-blog.controller';
import { BlogCategoryService } from 'src/blog-category/services/blog-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: BlogCategory.name,
        schema: BlogCategorySchema,
      },
    ]),
  ],
  controllers: [BlogController, SiteBlogController],
  providers: [BlogService, BlogCategoryService],
})
export class BlogModule {}
