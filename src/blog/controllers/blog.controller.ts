import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BlogDto } from '../dtos/blog.dto';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { BlogService } from '../services/blog.service';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DeleteFileDto, FileDto, FilesDto } from 'src/shared/dtos/file.dto';
import { ImagesPipe } from 'src/shared/pipes/images.pipe';

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

  // @Post(`:id/upload-image`)
  // @ApiOperation({
  //   summary: `upload image`,
  //   description: `upload image for a blog`,
  // })
  // @ApiParam({
  //   name: `id`,
  //   description: `id of blog`,
  //   example: `686a4b7b0a1d2c3e4f5a6b7c`,
  // })
  // @ApiConsumes(`multipart/form-data`)
  // @UseInterceptors(FileInterceptor(`file`))
  // uploadImage(
  //   @Param(`id`) id: string,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({
  //           maxSize: 20000000,
  //         }),
  //         new FileTypeValidator({
  //           fileType: /(image\/jpeg|image\/png|image\/jpg|image\/webp)/,
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @Body() body: FileDto,
  // ) {
  //   return this.blogService.uploadImage(id, file);
  // }

  @Post(`:id/upload-images`)
  @UseInterceptors(FilesInterceptor(`files`))
  @ApiConsumes(`multipart/form-data`)
  @ApiOperation({
    summary: `upload images`,
    description: `upload images for blog`,
  })
  @ApiParam({
    name: `id`,
    description: `id of blog`,
    example: `686a4b7b0a1d2c3e4f5a6b7c`,
  })
  addImages(
    @Param(`id`) id: string,
    @UploadedFiles(ImagesPipe) files: Array<Express.Multer.File>,
    @Body() body: FilesDto,
  ) {
    return this.blogService.uploadImages(id, files);
  }

  @Delete(`:id/delete-images`)
  @ApiOperation({
    summary: `delete images`,
    description: `delete images of blog`,
  })
  @ApiParam({
    name: `id`,
    description: `id of blog`,
    example: `686a4b7b0a1d2c3e4f5a6b7c`,
  })
  deleteImage(@Param(`id`) id: string, @Body() body: DeleteFileDto) {
    return this.blogService.deleteImage(id, body);
  }
}
