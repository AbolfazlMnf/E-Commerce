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
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { changePasswordDto } from '../dtos/change-password.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { ChangePasswordPipe } from 'src/shared/pipes/change-password.pipe';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { AddressQueryDto } from '../dtos/address-query.dto';
import { AddressService } from '../services/address.service';
import { AddressDto } from '../dtos/address.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { UpdateAddressDto } from '../dtos/update-address.dto';

@ApiTags(`Panel`)
@ApiBearerAuth()
@Controller('panel')
@UseGuards(JwtGuard)
export class PanelController {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}
  @Get(`:id`)
  getOne(@Param(`id`) id: string) {
    return this.userService.findOne(id);
  }
  @Patch(`change-password`)
  async changePassword(
    @Body(ChangePasswordPipe, new BodyIdPipe([`id`])) body: changePasswordDto,
  ) {
    const { newPassword, oldPassword, id } = body;
    const user = await this.userService.updateUser(id, {
      password: newPassword,
    });
    return user;
  }
  @Get('address')
  findAllAddresses(@Query() queryParams: AddressQueryDto) {
    return this.addressService.findAll(queryParams);
  }

  @Post('address')
  createAddress(@Body() body: AddressDto, @User() user: string) {
    return this.addressService.create(body, user);
  }

  @Get('address/:id')
  findOneAddress(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch('address/:id')
  editAddress(@Param('id') id: string, @Body() body: UpdateAddressDto) {
    return this.addressService.update(id, body);
  }

  @Delete('address/:id')
  deleteAddress(@Param('id') id: string) {
    return this.addressService.delete(id);
  }
}
