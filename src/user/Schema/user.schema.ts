import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Role {
  Admin = `admin`,
  User = `user`,
  CopyRighter = `copyRighter`,
}

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop()
  firstName!: string;
  @Prop()
  lastName!: string;
  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  mobile!: string;
  @Prop()
  role!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  code!: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
