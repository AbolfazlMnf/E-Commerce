import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../Schema/user.schema';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password!: string;
}

export class ResendDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  mobile!: string;
}

export class RoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({ required: true, enum: Role })
  role!: Role;
}
