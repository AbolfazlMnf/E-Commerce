import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { CartService } from '../services/cart.service';
import { User } from 'src/shared/decorators/user.decorator';
import { NewCartDto } from '../dtos/newcart.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { EditCartItemDto } from '../dtos/edit-cart-item.dto';
import { removeItemFromCartDto } from '../dtos/remove-item.dto';

@ApiTags(`Cart`)
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  createNewCart(
    @Body(new BodyIdPipe([`product`])) body: NewCartDto,
    @User() user: string,
  ) {
    return this.cartService.createNewCart(body, user);
  }
  @Get(`:id`)
  getCartDetail(@Param(`id`) id: string) {
    return this.cartService.getCartDetail(id);
  }

  @Patch(`edit-cart-item`)
  editCartItem(@Body(new BodyIdPipe([`cartItem`])) body: EditCartItemDto) {
    return this.cartService.editCartItem(body);
  }
  @Patch(`add-item-to-cart/:id`)
  addItemToCart(@Param(`id`) id: string, body: NewCartDto) {
    return this.cartService.addItemToCart(id, body);
  }
  @Delete(`remove-from-cart/:id`)
  removeItemFromCart(@Param(`id`) id: string, body: removeItemFromCartDto) {
    return this.cartService.removeItemFromCart(id, body);
  }
}
