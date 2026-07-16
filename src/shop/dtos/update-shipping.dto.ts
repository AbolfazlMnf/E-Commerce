import { PartialType } from '@nestjs/mapped-types';
import { ShippingDto } from '../../shop/dtos/shipping.dto';

export class UpdateShippingDto extends PartialType(ShippingDto) {}
