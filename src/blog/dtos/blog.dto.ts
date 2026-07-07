import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class BlogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content!: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: `blog category id`,
    example: `686a4b7b0a1d2c3e4f5a6b7c`,
  })
  category!: string;
}
