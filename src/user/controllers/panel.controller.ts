import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { changePasswordDto } from '../dtos/change-password.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { ChangePasswordPipe } from 'src/shared/pipes/change-password.pipe';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { PasswordInterceptor } from 'src/shared/interceptors/password.interceptor';

@ApiTags(`Panel`)
@ApiBearerAuth()
@Controller('panel')
@UseGuards(JwtGuard)
export class PanelController {
  constructor(private readonly userService: UserService) {}
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
}
