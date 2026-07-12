import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './Schema/blog.schema';
import {
  BlogCategory,
  BlogCategorySchema,
} from 'src/blog/Schema/blogCategory.Schema';
import { SiteBlogController } from './controllers/site-blog.controller';
import { BlogCategoryService } from 'src/blog/services/blog-category.service';
import { BlogCategoryController } from './controllers/blog-category.controller';

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
  controllers: [BlogController, SiteBlogController, BlogCategoryController],
  providers: [BlogService, BlogCategoryService],
})
export class BlogModule {}
