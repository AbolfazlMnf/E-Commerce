import { PartialType } from '@nestjs/mapped-types';
import { AddressDto } from './address.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto extends AddressDto {}
