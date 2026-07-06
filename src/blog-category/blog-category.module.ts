import { Module } from '@nestjs/common';
import { BlogCategoryController } from './controllers/blog-category.controller';
import { BlogCategoryService } from './services/blog-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogCategory, BlogCategorySchema } from './Schema/blogCategory.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlogCategory.name,
        schema: BlogCategorySchema,
      },
    ]),
  ],
  providers: [BlogCategoryService],
  controllers: [BlogCategoryController],
})
export class BlogCategoryModule {}
