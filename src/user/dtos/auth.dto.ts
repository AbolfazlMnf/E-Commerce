import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password!: string;
}

export class ResendDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  mobile!: string;
}
