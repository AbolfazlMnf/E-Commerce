import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogCategoryService } from '../services/blog-category.service';
import { ApiTags } from '@nestjs/swagger';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { BlogCategoryDto, UpdateCategoryDto } from '../dtos/blogCategory.dto';

@ApiTags(`Blog-Category`)
@Controller('blog-category')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}
  @Get()
  getAll(@Query() query: GeneralQueryDto) {
    return this.blogCategoryService.findAll(query);
  }
  @Get(`:id`)
  getOne(@Param(`id`) id: string) {
    return this.blogCategoryService.findOne(id);
  }
  @Post()
  create(@Body() body: BlogCategoryDto) {
    return this.blogCategoryService.create(body);
  }
  @Patch(`:id`)
  update(@Param(`id`) id: string, @Body() body: UpdateCategoryDto) {
    return this.blogCategoryService.update(id, body);
  }
  @Delete(`:id`)
  delete(@Param(`id`) id: string) {
    return this.blogCategoryService.delete(id);
  }
}
