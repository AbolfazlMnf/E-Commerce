import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { OrderService } from '../services/order.service';
import { CallbackQueryDto } from '../dtos/callback.query.dto';
import { OrderStatus } from '../schemas/order.schema';
import { response } from 'express';
import { CartService } from '../services/cart.service';

@ApiTags(`Site Order`)
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('site-order')
export class SiteOrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
  ) {}
  @Post()
  createOrder(@Body() body: CreateOrderDto, @User() user: string) {
    return this.orderService.createNewOrder(body, user);
  }
  @Get(`callback`)
  async callback(@Query() query: any) {
    if (query.authority) {
      await this.orderService.callback(query.authority ?? ``);
      return response.redirect(``);
    } else {
      return response.redirect(``);
    }
  }
}
