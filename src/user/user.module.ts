import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schema/user.schema';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PanelController } from './controllers/panel.controller';
import { Address, addressSchema } from './Schema/address.schema';
import { AddressService } from './services/address.service';

@Module({
  exports: [AddressService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Address.name,
        schema: addressSchema,
      },
    ]),
  ],
  controllers: [UserController, AuthController, PanelController],
  providers: [UserService, AuthService, AddressService],
})
export class UserModule {}
