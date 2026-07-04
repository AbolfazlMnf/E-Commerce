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
import { BlogDto } from '../dtos/blog.dto';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { BlogService } from '../services/blog.service';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(`Blogs`)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Get()
  findAll(@Query() query: GeneralQueryDto) {
    return this.blogService.findAll(query);
  }
  @Get(`:id`)
  findOne(@Param(`id`) id: string) {
    return this.blogService.findOne(id);
  }
  @Post()
  create(@Body() body: BlogDto) {
    return this.blogService.create(body);
  }
  @Patch(`:id`)
  update(@Param(`id`) id: string, @Body() body: UpdateBlogDto) {
    return this.blogService.update(id, body);
  }
  @Delete(`:id`)
  delete(@Param(`id`) id: string) {
    return this.blogService.delete(id);
  }
}
