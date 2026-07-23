import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';

export enum ProductSort {
  Title = `title`,
  CreatedAt = `createdAt`,
  UpdatedAt = `updatedAt`,
  Price = `price`,
}

export class ProductQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  category?: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  exclude?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  sort?: ProductSort;
}
