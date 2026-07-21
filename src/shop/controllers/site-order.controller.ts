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
import { CreateOrderDto } from '../dtos/create-order.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { OrderService } from '../services/order.service';
import { response } from 'express';
import { CartService } from '../services/cart.service';
import { orderQueryDto } from '../dtos/order-query.dto';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/Schema/user.schema';
import { changeOrderStatusDto } from '../dtos/change-orderStatus.dto';

@ApiTags(`Order`)
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('order')
export class SiteOrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
  ) {}

  @Get(`all`)
  findAll(@Query() queries: orderQueryDto) {
    return this.orderService.findAllOrder(queries);
  }

  @Get(`:id`)
  findOne(@Param(`id`) id: string) {
    return this.orderService.orderDetail(id);
  }

  @Patch(`Admin/:id/change-status`)
  @UseGuards(new RoleGuard([Role.Admin]))
  changeStatus(@Body() body: changeOrderStatusDto, @Param(`id`) id: string) {
    return this.orderService.changeOrderStatus(id, body.status);
  }

  @Post()
  createOrder(@Body() body: CreateOrderDto, @User() user: string) {
    return this.orderService.createNewOrder(body, user);
  }
  @Get(`verify-callback`)
  async callback(@Query() query: any) {
    if (query?.authority) {
      await this.orderService.callback(query.authority);
      return { message: `the order is checked` };
    } else {
      return { message: `authority code is needed` };
    }
  }
}
