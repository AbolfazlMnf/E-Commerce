import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlogCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  content?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url!: string;
}

export class UpdateCategoryDto extends PartialType(BlogCategoryDto) {}
