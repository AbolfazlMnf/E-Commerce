import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PublicImageDto {
  @IsNotEmpty()
  @ApiProperty({ type: `string`, format: `binary`, required: true })
  image!: any;

  @IsString()
  @IsOptional()
  @ApiProperty()
  folder?: string;
}
