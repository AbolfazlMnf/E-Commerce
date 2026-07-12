import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';

export enum Sort {
  Title = `title`,
  CreatedAt = `createdAt`,
  UpdatedAt = `updatedAt`,
}

export class BlogCategoryQueryDto extends GeneralQueryDto {
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: `array`,
    required: false,
    items: {
      type: `string`,
    },
  })
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
