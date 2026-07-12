import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogCategoryService } from 'src/blog-category/services/blog-category.service';
import { BlogQueryDto } from '../dtos/blog.query.dto';
import { ApiTags } from '@nestjs/swagger';
import { BlogCategoryQueryDto } from 'src/blog-category/dtos/blogCategory.query.dto';
import { BlogService } from '../services/blog.service';

@ApiTags(`Public Blog`)
@Controller('site/blogs')
export class SiteBlogController {
  constructor(
    private readonly blogCategoryService: BlogCategoryService,
    private readonly blogService: BlogService,
  ) {}
  @Get(`categories`)
  async findAll(@Query() query: BlogCategoryQueryDto) {
    return this.blogCategoryService.findAll(query, {
      title: 1,
      url: 1,
      image: 1,
    });
  }
  @Get(`/category/:url`)
  async findBlogs(@Param(`url`) url: string, @Query() queries: BlogQueryDto) {
    const category = await this.blogCategoryService.findOneWithUrl(url);
    const { blogs, count, page } = await this.blogService.findAll({
      ...queries,
      category: category._id.toString(),
    });
    return { category, blogs, count, page };
  }
  @Get(`:url`)
  async getOne(@Param(`url`) url: string) {
    const blog = await this.blogService.findOneWithUrl(url);
    const relatedBlogs = await this.blogService.findAll({
      exclude: [blog._id.toString()],
      category: blog.category._id.toString(),
    });
    return { blog, relatedBlogs };
  }
}
