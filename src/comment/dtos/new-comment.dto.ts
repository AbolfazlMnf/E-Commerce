import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class NewCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  product!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  content!: string;
}
