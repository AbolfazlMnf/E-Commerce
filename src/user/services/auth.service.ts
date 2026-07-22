import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, compareSync, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { AuthDto } from 'src/user/dtos/auth.dto';
import { User } from 'src/user/Schema/user.schema';
import { ConfirmDto } from '../dtos/confirm.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(body: AuthDto) {
    const user = await this.findUserByMobile(body.mobile);
    const isMatchPassword = await compare(body.password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException(`the password is not correct`);
    } else {
      const code = await this.sendCode(body.mobile);
      return { message: `code sent`, code };
    }
  }
  async findUserByMobile(mobile: string) {
    const user = await this.userModel.findOne({ mobile });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  async sendCode(mobile: string) {
    const user = await this.findUserByMobile(mobile);
    const code = Math.floor(Math.random() * 90000) + 10000;
    const hashedCode = await hash(code.toString(), 10);
    user.code = hashedCode;
    console.log(code);
    await user.save();
    return code;
  }
  async confirm(body: ConfirmDto) {
    const user = await this.findUserByMobile(body.mobile);
    const isMatchedCode = compareSync(body.code, user.code);
    if (!isMatchedCode) {
      throw new BadRequestException(`the code is not correct`);
    } else {
      const payload = { _id: user._id, role: user.role };
      const token = this.jwtService.sign(payload);
      return { token };
    }
  }
}
