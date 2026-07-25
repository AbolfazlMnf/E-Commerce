import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class ShippingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  price!: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @ApiProperty()
  freeShippingThreshold?: number;
}
