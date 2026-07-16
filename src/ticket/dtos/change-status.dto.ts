import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../Schemas/ticket.Schema';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeTicketStatusDto {
  @IsNotEmpty()
  @IsEnum(TicketStatus)
  @ApiProperty({ enum: TicketStatus })
  status!: TicketStatus;
}
