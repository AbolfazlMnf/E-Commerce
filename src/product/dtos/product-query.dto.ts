import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  category?: string;

  @IsOptional()
  @IsString()
  exclude?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  sort?: ProductSort;
}
