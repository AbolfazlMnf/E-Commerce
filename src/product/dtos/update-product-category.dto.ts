import { PartialType } from '@nestjs/swagger';
import { ProductCategoryDto } from './product-category.dto';

export class UpdateProductCategoryDto extends PartialType(ProductCategoryDto) {}
