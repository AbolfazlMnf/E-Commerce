import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Sort } from 'src/blog/dtos/blog.query.dto';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';

export class ImageQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsEnum(Sort)
  @ApiProperty({ enum: Sort, required: false })
  sort?: Sort;
}
