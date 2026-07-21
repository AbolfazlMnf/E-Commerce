import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';
import { ApiProperty } from '@nestjs/swagger';

export class changeOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus;
}
