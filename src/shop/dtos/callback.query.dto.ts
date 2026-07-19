import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CallbackQueryDto {
  @IsString()
  @MaxLength(36)
  @IsNotEmpty()
  @ApiProperty()
  authority!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status!: string;
}
