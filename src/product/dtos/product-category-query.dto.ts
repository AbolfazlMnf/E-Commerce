import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Sort } from 'src/blog/dtos/blog.query.dto';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';

export class ProductCategoryQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  url?: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  sort?: Sort;
}
