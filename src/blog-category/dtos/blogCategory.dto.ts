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
}

export class UpdateCategoryDto extends PartialType(BlogCategoryDto) {}
