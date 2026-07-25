import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class NewCartDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  product!: string;
}
