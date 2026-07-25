import { GeneralQueryDto } from 'src/shared/dtos/query.dto';
import { TicketStatus } from '../Schemas/ticket.Schema';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sort } from 'src/blog/dtos/blog.query.dto';

export class TicketQueryDto extends GeneralQueryDto {
  @IsEnum(TicketStatus)
  @IsOptional()
  @ApiProperty({ enum: TicketStatus, required: false })
  status?: TicketStatus;

  @IsEnum(Sort)
  @IsOptional()
  @ApiProperty({ enum: Sort, required: false })
  sort?: Sort;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  user!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  title?: string;
}
