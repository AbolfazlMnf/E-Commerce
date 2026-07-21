import { IsEnum, IsNotEmpty } from 'class-validator';
import { CommentStatus } from '../schemas/comment.schema';

export class CommentStatusDto {
  @IsNotEmpty()
  @IsEnum(CommentStatus)
  status!: CommentStatus;
}
