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
import {
  inventoryRecord,
  inventoryRecordSchema,
} from 'src/inventory/schemas/inventory-record.schema';
import { InventoryRecordService } from 'src/inventory/services/inventory-record.service';

@Module({
  controllers: [
    ProductController,
    ProductCategoryController,
    SiteProductsController,
  ],
  providers: [ProductService, ProductCategoryService, InventoryRecordService],
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
      {
        name: inventoryRecord.name,
        schema: inventoryRecordSchema,
      },
    ]),
  ],
})
export class ProductModule {}
