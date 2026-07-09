import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';

export enum Sort {
  Title = `title`,
  CreatedAt = `createdAt`,
  UpdatedAt = `updatedAt`,
}

export enum Order {
  Desc = `DESC`,
  Asc = `ASC`,
}

export class GeneralQueryDto {
  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional({ description: `default=1` })
  limit?: number;

  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional({ description: `default=1` })
  page?: number;

  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsEnum(Sort)
  @ApiPropertyOptional({
    enum: Sort,
    description: `default = ${Sort.CreatedAt} `,
  })
  sort?: Sort;

  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({ enum: Order, description: `default = ${Order.Desc} ` })
  order?: Order;
}
