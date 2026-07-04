import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './Schema/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
