import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  code!: string;
}
