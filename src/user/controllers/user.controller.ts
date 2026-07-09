import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserQueryDto } from '../dtos/user.query.dto';
import { UpdateUserDto, UserDto } from '../dtos/User.dto';
import { EnglishPipe } from 'src/shared/pipes/english.pipe';
import { MobilePipe } from 'src/shared/pipes/mobile.pipe';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';

@ApiTags(`Users`)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(@Query() queries: UserQueryDto) {
    return this.userService.getAll(queries);
  }
  @Get(`:id`)
  getOne(@Param(`id`) id: string) {
    return this.userService.findOne(id);
  }
  @Patch(`:id`)
  @ApiOperation({
    description: `update user info`,
  })
  update(
    @Param(`id`) id: string,
    @Body(EnglishPipe, MobilePipe, new PasswordPipe(true)) body: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, body);
  }
  @Delete(`:id`)
  delete(@Param(`id`) id: string) {
    return this.userService.deleteUser(id);
  }
}
