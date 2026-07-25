import { PartialType } from '@nestjs/swagger';
import { ShippingDto } from '../../shop/dtos/shipping.dto';

export class UpdateShippingDto extends PartialType(ShippingDto) {}
