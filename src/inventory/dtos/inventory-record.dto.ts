import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Action, EditedBy } from '../schemas/inventory-record.schema';
import { ApiProperty } from '@nestjs/swagger';

export class InventoryRecordDto {
  @IsNotEmpty()
  @IsEnum(Action)
  @ApiProperty({ enum: Action })
  action!: Action;

  @IsNotEmpty()
  @IsEnum(EditedBy)
  @ApiProperty({ enum: EditedBy })
  editedBy!: EditedBy;

  @IsOptional()
  @IsString()
  @ApiProperty()
  order?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  product!: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  quantity!: number;
}
