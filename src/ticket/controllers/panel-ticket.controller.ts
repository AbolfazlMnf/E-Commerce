import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { TicketService } from '../services/ticket.service';
import { NewTicketDto } from '../dtos/new-ticket.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { TicketMessagePipe } from 'src/shared/pipes/ticket-message.pipe';
import { TicketQueryDto } from '../dtos/ticket.query.dto';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/Schema/user.schema';
import { TicketStatus } from '../Schemas/ticket.Schema';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { TicketMessageDto } from '../dtos/ticket-message.dto';
import { ChangeTicketStatusDto } from '../dtos/change-status.dto';

@ApiTags(`Panel Ticket`)
@Controller('panel-ticket')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class PanelTicketController {
  constructor(private readonly ticketService: TicketService) {}
  @Get()
  userGetAll(@Query() queries: TicketQueryDto) {
    return this.ticketService.findAll(queries);
  }

  @Get(`:id`)
  userFindTicket(@Param(`id`) id: string) {
    return this.ticketService.findOneTicket(id);
  }
  @Post(`new-ticket`)
  async createNewTicket(
    @Body(TicketMessagePipe) body: NewTicketDto,
    @User() user: string,
  ) {
    const newTicket = await this.ticketService.createNewTicket(
      body.title,
      user,
    );
    const newTicketMessage = await this.ticketService.createNewTicketMessage(
      {
        ticket: newTicket._id.toString(),
        content: body.content,
        image: body.image,
      },
      user,
      TicketStatus.Pending,
    );
    return this.ticketService.findOneTicket(newTicket._id.toString());
  }
  @Post(`message`)
  async userSendMessage(
    @Body(new BodyIdPipe([`ticket`]), TicketMessagePipe) body: TicketMessageDto,
    @User() user: string,
  ) {
    return this.ticketService.createNewTicketMessage(
      body,
      user,
      TicketStatus.Pending,
    );
  }

  @Post(`Admin/message`)
  @UseGuards(new RoleGuard([Role.Admin]))
  async SendMessage(
    @Body(new BodyIdPipe([`ticket`]), TicketMessagePipe) body: TicketMessageDto,
    @User() user: string,
  ) {
    return this.ticketService.createNewTicketMessage(
      body,
      user,
      TicketStatus.Responded,
    );
  }
  @Patch(`Admin/:id/change-status`)
  @UseGuards(new RoleGuard([Role.Admin]))
  async changeStatus(
    @Param(`id`) id: string,
    @Body() body: ChangeTicketStatusDto,
  ) {
    await this.ticketService.changeStatus(id, body.status);
    return { message: `status changed` };
  }
}
