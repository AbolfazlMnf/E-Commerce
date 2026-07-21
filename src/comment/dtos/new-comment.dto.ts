import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class NewCommentDto {
  @IsString()
  @IsNotEmpty()
  product!: string;

  @IsString()
  @IsOptional()
  content!: string;
}
