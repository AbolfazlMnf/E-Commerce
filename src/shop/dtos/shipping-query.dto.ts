import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Sort } from 'src/blog/dtos/blog.query.dto';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';

export class ShippingQueryDto extends GeneralQueryDto {
  @IsEnum(Sort)
  @IsOptional()
  @ApiProperty({ enum: Sort })
  sort?: Sort;

  @IsString()
  @IsOptional()
  @ApiProperty()
  title?: string;
}
