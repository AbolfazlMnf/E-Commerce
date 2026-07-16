import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';

export enum Action {
  Add = `add`,
  Remove = `remove`,
}

export enum EditedBy {
  Admin = `admin`,
  Order = `order`,
}

@Schema({ timestamps: true, versionKey: false })
export class inventoryRecord extends Document {
  @Prop()
  action!: Action;

  @Prop()
  editedBy!: EditedBy;

  @Prop()
  quantity!: number;

  @Prop({ required: false, default: null })
  order?: string;

  @Prop({ ref: Product.name, type: Types.ObjectId, required: true })
  product!: Product;
}

export const inventoryRecordSchema =
  SchemaFactory.createForClass(inventoryRecord);
