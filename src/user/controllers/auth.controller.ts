import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../dtos/User.dto';
import { EnglishPipe } from 'src/shared/pipes/english.pipe';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';
import { MobilePipe } from 'src/shared/pipes/mobile.pipe';
import { AuthDto, ResendDto } from '../dtos/auth.dto';
import { ConfirmDto } from '../dtos/confirm.dto';
import { PasswordInterceptor } from 'src/shared/interceptors/password.interceptor';

@ApiTags(`Authentication`)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post(`sign-up`)
  @UseInterceptors(PasswordInterceptor)
  async signUp(
    @Body(EnglishPipe, MobilePipe, new PasswordPipe(true)) body: UserDto,
  ) {
    const user = await this.userService.create(body);
    if (user._id) {
      await this.authService.sendCode(user.mobile);
      return { message: `code sent` };
    }
  }
  @Post(`login`)
  login(@Body(MobilePipe, new PasswordPipe(false)) body: AuthDto) {
    return this.authService.signIn(body);
  }
  @Post(`login/confirm`)
  confirm(@Body() body: ConfirmDto) {
    return this.authService.confirm(body);
  }
  @Post(`resend`)
  resend(@Body(MobilePipe) body: ResendDto) {
    return this.authService.sendCode(body.mobile);
  }
}
