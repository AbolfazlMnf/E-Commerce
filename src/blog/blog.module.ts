import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './Schema/blog.schema';
import {
  BlogCategory,
  BlogCategorySchema,
} from 'src/blog-category/Schema/blogCategory.Schema';

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
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
