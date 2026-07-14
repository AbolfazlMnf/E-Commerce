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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  DeleteProductImages,
  DeleteProductThumbnail,
  ProductDto,
  ProductImagesDto,
  ProductThumbnailDto,
} from '../dtos/product.dto';
import { ProductService } from '../services/product.service';
import { ProductQueryDto } from '../dtos/product-query.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/Schema/user.schema';
import { slugPipe } from 'src/shared/pipes/slug.pipe';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImagesPipe } from 'src/shared/pipes/images.pipe';
import { FilesDto } from 'src/shared/dtos/file.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtGuard, new RoleGuard([Role.Admin, Role.CopyRighter]))
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  findAll(@Query() queryParams: ProductQueryDto) {
    return this.productService.findAll(queryParams);
  }

  @Post()
  create(@Body(slugPipe, new BodyIdPipe([`category`])) body: ProductDto) {
    return this.productService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(slugPipe, new BodyIdPipe([`category`])) body: UpdateProductDto,
  ) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
  @Post(`:id/upload-images`)
  @UseInterceptors(FilesInterceptor(`images`))
  @ApiConsumes(`multipart/form-data`)
  async uploadImages(
    @UploadedFiles(ImagesPipe) files: Array<Express.Multer.File>,
    @Body() body: ProductImagesDto,
    @Param(`id`) id: string,
  ) {
    return this.productService.uploadImages(id, files);
  }
  @Delete(`:id/images`)
  deleteImages(@Param(`id`) id: string, @Query() query: DeleteProductImages) {
    return this.productService.deleteImages(id, query.images);
  }
  @Post(`:id/thumbnail`)
  @UseInterceptors(FileInterceptor(`thumbnail`))
  @ApiConsumes(`multipart/form-data`)
  uploadThumb(
    @Param(`id`) id: string,
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
    @Body() body: ProductThumbnailDto,
  ) {
    return this.productService.uploadThumbnail(id, file);
  }

  @Delete(`:id/thumbnail`)
  deleteThumbnail(
    @Param(`id`) id: string,
    @Query() query: DeleteProductThumbnail,
  ) {
    return this.productService.deleteThumb(id, query.thumbnail);
  }
}
