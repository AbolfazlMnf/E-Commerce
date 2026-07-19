import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shippingId!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  cartId!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  addressId!: string;
}
