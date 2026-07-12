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
  })
  sort?: SeoSort;

  @IsOptional()
  @IsString()
  @ApiProperty()
  seoTitle?: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  url!: string;
}
