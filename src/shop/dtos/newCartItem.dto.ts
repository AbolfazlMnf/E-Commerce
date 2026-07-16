import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewCartItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  product!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  cart!: string;
}
