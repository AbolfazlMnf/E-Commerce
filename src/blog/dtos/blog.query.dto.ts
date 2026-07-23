import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';

export enum Sort {
  Title = `title`,
  CreatedAt = `createdAt`,
  UpdatedAt = `updatedAt`,
}

export class BlogQueryDto extends GeneralQueryDto {
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @ApiHideProperty()
  exclude?: string[];

  @IsOptional()
  @ApiPropertyOptional()
  url?: string;

  @IsOptional()
  @IsEnum(Sort)
  @ApiPropertyOptional({
    enum: Sort,
    description: `default = ${Sort.CreatedAt} `,
  })
  sort?: Sort;
}
