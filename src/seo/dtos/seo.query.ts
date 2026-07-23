import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';

export enum SeoSort {
  Title = `seoTitle`,
  CreatedAt = `createdAt`,
  UpdatedAt = `updatedAt`,
}

export class SeoQueryDto extends GeneralQueryDto {
  @IsEnum(SeoSort)
  @IsOptional()
  @ApiProperty({
    enum: SeoSort,
    required: false,
  })
  sort?: SeoSort;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  seoTitle?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  url!: string;
}
