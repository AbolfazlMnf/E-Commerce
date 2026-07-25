import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { CartService } from '../services/cart.service';
import { User } from 'src/shared/decorators/user.decorator';
import { NewCartDto } from '../dtos/newcart.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { EditCartItemDto } from '../dtos/edit-cart-item.dto';
import { removeItemFromCartDto } from '../dtos/remove-item.dto';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/Schema/user.schema';
import { CartQueryDto } from '../dtos/cart-query.dto';

@ApiTags(`Cart`)
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Get(`Admin/all-carts`)
  @UseGuards(new RoleGuard([Role.Admin]))
  geyAll(@Query() query: CartQueryDto) {
    return this.cartService.findAllCarts(query);
  }
  @Get(`user-cart`)
  getUserCart(@User() user: string) {
    return this.cartService.findUserCart(user);
  }
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
  @ApiParam({ name: `id`, description: `id of cart` })
  addItemToCart(@Param(`id`) id: string, @Body() body: NewCartDto) {
    return this.cartService.addItemToCart(id, body);
  }
  @Delete(`remove-from-cart/:id`)
  removeItemFromCart(
    @Param(`id`) id: string,
    @Body() body: removeItemFromCartDto,
  ) {
    return this.cartService.removeItemFromCart(id, body);
  }
}
