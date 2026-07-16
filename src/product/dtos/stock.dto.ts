import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StockDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false, type: Number })
  quantity!: number;
}
