import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { Order } from 'src/shared/dtos/query.dto';

export enum UserSort {
  LastName = `lastName`,
  CreatedAt = `createdAt`,
  UpdatedAt = `updatedAt`,
}

export class UserQueryDto {
  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional({ description: `default = 5` })
  limit?: number;

  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional({
    description: `default = 1`,
  })
  page?: number;

  @IsOptional()
  @ApiPropertyOptional()
  lastName?: string;
  @IsOptional()
  @ApiPropertyOptional()
  mobile?: string;

  @IsOptional()
  @IsEnum(UserSort)
  @ApiPropertyOptional({ enum: UserSort })
  sort?: UserSort;

  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({ enum: Order, description: `default = DESC` })
  order?: Order;
}
