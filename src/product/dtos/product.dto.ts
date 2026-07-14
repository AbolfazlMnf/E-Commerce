import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  Allow,
} from 'class-validator';
export class ProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content!: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  discount!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  url!: string;
}

export class ProductImagesDto {
  @ApiProperty({
    type: `array`,
    required: true,
    items: {
      type: `string`,
      format: `binary`,
    },
  })
  @Allow()
  images!: any;
}

export class ProductThumbnailDto {
  @ApiProperty({
    type: `string`,
    format: `binary`,
    required: true,
  })
  @Allow()
  thumbnail!: any;
}

export class DeleteProductImages {
  @ApiProperty({
    required: true,
    type: `array`,
    items: {
      type: `string`,
    },
  })
  images!: string[];
}

export class DeleteProductThumbnail {
  @ApiProperty({
    required: true,
    type: `string`,
  })
  thumbnail!: string;
}
