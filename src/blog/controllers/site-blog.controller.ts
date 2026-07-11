import { Controller, Get, Query } from '@nestjs/common';
import { BlogCategoryService } from 'src/blog-category/services/blog-category.service';
import { BlogQueryDto } from '../dtos/blog.query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(`Public Blog`)
@Controller('site/blog')
export class SiteBlogController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}
  @Get(`categories`)
  async findAll(@Query() query: BlogQueryDto) {
    return this.blogCategoryService.findAll(query, {
      title: 1,
      url: 1,
      image: 1,
    });
  }
}
