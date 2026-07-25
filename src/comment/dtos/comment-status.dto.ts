import { IsEnum, IsNotEmpty } from 'class-validator';
import { CommentStatus } from '../schemas/comment.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CommentStatusDto {
  @IsNotEmpty()
  @IsEnum(CommentStatus)
  @ApiProperty({ enum: CommentStatus })
  status!: CommentStatus;
}
