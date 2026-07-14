import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCategoryService } from './services/product-category.service';
import { Product, productSchema } from './schemas/product.schema';
import {
  ProductCategory,
  productCategorySchema,
} from './schemas/product-category.schema';
import { ProductCategoryController } from './controllers/product-category.controller';
import { ProductController } from './controllers/product.controller';
import { SiteProductsController } from './controllers/site-products.controller';

@Module({
  controllers: [ProductController, ProductCategoryController, SiteProductsController],
  providers: [ProductService, ProductCategoryService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: productSchema,
      },
      {
        name: ProductCategory.name,
        schema: productCategorySchema,
      },
    ]),
  ],
})
export class ProductModule {}
