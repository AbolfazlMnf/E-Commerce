import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

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

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  callback_url?: string;
}
