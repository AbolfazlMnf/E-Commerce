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
  @ApiPropertyOptional()
  limit?: number;

  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsEnum(Sort)
  @ApiPropertyOptional({ enum: Sort })
  sort?: Sort;

  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({ enum: Order })
  order?: Order;
}
