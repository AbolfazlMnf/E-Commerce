import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SeoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  seoTitle!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  seoDescription!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  h1?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  content?: string;
}

export class UpdateSeoDto extends PartialType(SeoDto) {}
