import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketStatus } from '../Schemas/ticket.Schema';
import { Model } from 'mongoose';
import { TicketMessage } from '../Schemas/ticket.message.schema';
import { TicketMessageDto } from '../dtos/ticket-message.dto';
import { getSortOption } from 'src/shared/utils/sort';
import { TicketQueryDto } from '../dtos/ticket.query.dto';
import { sortOrder } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(TicketMessage.name)
    private readonly ticketMessageModel: Model<TicketMessage>,
  ) {}

  async createNewTicket(title: string, user: string) {
    const newTicket = new this.ticketModel({
      title,
      user,
      status: TicketStatus.Pending,
    });
    await newTicket.save();
    return newTicket;
  }
  async createNewTicketMessage(
    body: TicketMessageDto,
    user: string,
    status: TicketStatus,
  ) {
    const newTicketMessage = new this.ticketMessageModel({ ...body, user });
    await newTicketMessage.save();
    await this.changeStatus(body.ticket, status);
    return newTicketMessage;
  }
  async findOneTicket(id: string) {
    const ticket = await this.ticketModel
      .findById(id)
      .populate([
        {
          path: `user`,
          select: `firstName lastName`,
        },
      ])
      .exec();
    if (!ticket) {
      throw new BadRequestException();
    }
    const messages = await this.ticketMessageModel
      .find({
        ticket: ticket?._id.toString(),
      })
      .sort({ createdAt: 1 })
      .populate([
        {
          path: `user`,
          select: `firstName lastName`,
        },
      ])
      .exec();
    return { ticket, messages };
  }
  async findAll(queryParams: TicketQueryDto, selectObject: any = { __v: 0 }) {
    const {
      limit = 10,
      page = 1,
      title,
      user,
      status,
      sort,
      order = sortOrder.Desc,
    } = queryParams;

    const query: any = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (user) query.user = user;
    if (status) query.status = status;

    const orderOption = getOrderOption(order);
    const sortObject = getSortOption(orderOption, sort);

    const tickets = await this.ticketModel
      .find(query)
      .skip(page - 1)
      .limit(limit)
      .populate('user', { firstName: 1, lastName: 1 })
      .sort(sortObject)
      .select(selectObject)
      .exec();

    const count = await this.ticketModel.countDocuments(query);

    return { count, tickets };
  }
  async changeStatus(id: string, status: TicketStatus) {
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException();
    }
    ticket.status = status;
    await ticket.save();
  }
}
