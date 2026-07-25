import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommentStatus } from '../schemas/comment.schema';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { Sort } from 'src/blog/dtos/blog.query.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  content?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  user?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  product?: string;

  @IsOptional()
  @IsEnum(CommentStatus)
  @ApiProperty({ enum: CommentStatus, required: false })
  status?: CommentStatus;

  @IsOptional()
  @IsEnum(Sort)
  @ApiProperty({ enum: Sort, required: false })
  sort?: Sort;
}
