import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommentStatus } from '../schemas/comment.schema';
import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { Sort } from 'src/blog/dtos/blog.query.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  content?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  user?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  product?: string;

  @IsOptional()
  @IsEnum(CommentStatus)
  @ApiProperty({ enum: CommentStatus })
  status?: CommentStatus;

  @IsOptional()
  @IsEnum(Sort)
  @ApiProperty({ enum: Sort })
  sort?: Sort;
}
