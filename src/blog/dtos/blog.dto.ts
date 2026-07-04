import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BlogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content!: string;
}
