import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategoryQueryDto } from '../dtos/product-category-query.dto';
import { ProductQueryDto } from '../dtos/product-query.dto';

@ApiTags(`Public Products`)
@Controller('site/products')
export class SiteProductsController {
  constructor(
    private readonly productService: ProductService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}
  @Get(`categories`)
  getAllCats(@Query() queries: ProductCategoryQueryDto) {
    return this.productCategoryService.findAll(queries);
  }
  @Get(`category/:url`)
  async findCat(@Param(`url`) url: string, @Query() queries: ProductQueryDto) {
    const category = await this.productCategoryService.findOneWithUrl(url);
    const { products, count } = await this.productService.findAll({
      ...queries,
      category: category._id.toString(),
    });
    return { category, products, count };
  }
  @Get(`:url`)
  async findProducts(@Param(`url`) url: string) {
    const product = await this.productService.findOneWithUrl(url);
    const relatedProducts = await this.productService.findAll({
      category: product.category._id.toString(),
      exclude: [product._id.toString()],
    });
    return { product, relatedProducts };
  }
}
