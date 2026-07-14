import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Allow } from 'class-validator';
export class ProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url!: string;
}

export class ProductCategoryImageDto {
  @ApiProperty({
    required: true,
    type: `string`,
    format: `binary`,
  })
  @Allow()
  image!: any;
}
export class DeleteProductCategoryImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  image!: string;
}
