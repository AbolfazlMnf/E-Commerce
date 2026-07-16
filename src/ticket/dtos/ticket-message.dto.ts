import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class TicketMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ticket!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  image?: string;
}
