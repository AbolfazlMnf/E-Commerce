import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { TicketStatus } from '../Schemas/ticket.Schema';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sort } from 'src/blog/dtos/blog.query.dto';

export class TicketQueryDto extends GeneralQueryDto {
  @IsEnum(TicketStatus)
  @IsOptional()
  @ApiProperty({ enum: TicketStatus })
  status?: TicketStatus;

  @IsEnum(Sort)
  @IsOptional()
  @ApiProperty({ enum: Sort })
  sort?: Sort;

  @IsString()
  @IsOptional()
  @ApiProperty()
  user!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  title?: string;
}
