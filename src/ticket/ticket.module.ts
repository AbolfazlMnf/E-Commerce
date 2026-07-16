import { Module } from '@nestjs/common';
import { PanelTicketController } from './controllers/panel-ticket.controller';
import { TicketService } from './services/ticket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, ticketSchema } from './Schemas/ticket.Schema';
import {
  TicketMessage,
  ticketMessageSchema,
} from './Schemas/ticket.message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: ticketSchema,
      },
      {
        name: TicketMessage.name,
        schema: ticketMessageSchema,
      },
    ]),
  ],
  controllers: [PanelTicketController],
  providers: [TicketService],
})
export class TicketModule {}
