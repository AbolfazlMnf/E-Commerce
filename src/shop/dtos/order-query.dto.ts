import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { OrderStatus } from '../schemas/order.schema';
import { Sort } from 'src/blog/dtos/blog.query.dto';

export class orderQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  user?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiProperty({ required: false, enum: OrderStatus })
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(Sort)
  @ApiProperty({ required: false, enum: Sort })
  sort?: Sort;
}
