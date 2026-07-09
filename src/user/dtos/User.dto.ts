import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
