import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class EditCartItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  cartItem!: string;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  quantity!: number;
}
