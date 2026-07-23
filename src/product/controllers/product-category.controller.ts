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
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  DeleteProductCategoryImageDto,
  ProductCategoryDto,
  ProductCategoryImageDto,
} from '../dtos/product-category.dto';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategoryQueryDto } from '../dtos/product-category-query.dto';
import { UpdateProductCategoryDto } from '../dtos/update-product-category.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/Schema/user.schema';
import { slugPipe } from 'src/shared/pipes/slug.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Product-Category')
@Controller('product-category')
@UseGuards(JwtGuard, new RoleGuard([Role.Admin, Role.CopyRighter]))
@ApiBearerAuth()
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}
  @Get()
  findAll(@Query() queryParams: ProductCategoryQueryDto) {
    return this.productCategoryService.findAll(queryParams);
  }

  @Post()
  create(@Body(slugPipe) body: ProductCategoryDto) {
    return this.productCategoryService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(slugPipe) body: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productCategoryService.delete(id);
  }

  @Post(`:id/image`)
  @UseInterceptors(FileInterceptor(`image`))
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
    @Body() body: ProductCategoryImageDto,
  ) {
    return this.productCategoryService.uploadImage(id, file);
  }

  @Delete(`:id/image`)
  deleteThumbnail(
    @Param(`id`) id: string,
    @Query() query: DeleteProductCategoryImageDto,
  ) {
    return this.productCategoryService.deleteImage(id, query.image);
  }
}
