import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/Schema/user.schema';

export enum TicketStatus {
  Pending = 'pending',
  Responded = 'responded',
  Closed = 'closed',
}

@Schema({ timestamps: true, versionKey: false })
export class Ticket extends Document {
  @Prop()
  title!: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: User;

  @Prop()
  status!: TicketStatus;
}

export const ticketSchema = SchemaFactory.createForClass(Ticket);
