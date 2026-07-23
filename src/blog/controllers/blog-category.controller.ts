import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogCategoryService } from '../services/blog-category.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BlogCategoryDto, UpdateCategoryDto } from '../dtos/blogCategory.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/Schema/user.schema';
import { BlogQueryDto } from 'src/blog/dtos/blog.query.dto';
import { slugPipe } from 'src/shared/pipes/slug.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from 'src/shared/dtos/file.dto';
import { BlogCategoryQueryDto } from '../dtos/blogCategory.query.dto';

@ApiTags(`Blog-Category`)
@ApiBearerAuth()
@Controller('blog-category')
@UseGuards(JwtGuard, new RoleGuard([Role.Admin, Role.CopyRighter]))
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}
  @Get()
  getAll(@Query() query: BlogCategoryQueryDto) {
    return this.blogCategoryService.findAll(query);
  }
  @Get(`:id`)
  getOne(@Param(`id`) id: string) {
    return this.blogCategoryService.findOne(id);
  }
  @Post()
  create(@Body(slugPipe) body: BlogCategoryDto) {
    return this.blogCategoryService.create(body);
  }
  @Patch(`:id`)
  update(@Param(`id`) id: string, @Body(slugPipe) body: UpdateCategoryDto) {
    return this.blogCategoryService.update(id, body);
  }
  @Delete(`:id`)
  delete(@Param(`id`) id: string) {
    return this.blogCategoryService.delete(id);
  }
  @Post(`:id/upload-image`)
  @ApiParam({
    name: `id`,
    description: `id of a category`,
  })
  @ApiConsumes(`multipart/form-data`)
  @UseInterceptors(FileInterceptor(`file`))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 20000000,
          }),
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/png|image\/jpg|image\/webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: FileDto,
    @Param(`id`) id: string,
  ) {
    return this.blogCategoryService.UploadImage(id, file);
  }
  @Delete(`:id`)
  @ApiOperation({
    summary: `delete image`,
    description: `delete image of a blog-category`,
  })
  @ApiParam({
    name: `id`,
    description: `id of a category`,
  })
  deleteImage(@Param(`id`) id: string) {
    return this.blogCategoryService.delete(id);
  }
}
