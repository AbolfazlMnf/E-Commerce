import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductDto } from '../dtos/product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { ProductQueryDto } from '../dtos/product-query.dto';

import { UpdateProductDto } from '../dtos/update-product.dto';
import { getProductSortOption } from 'src/shared/utils/sort';
import { getOrderOption } from 'src/shared/utils/order';
import { Order } from 'src/shared/dtos/query.dto';
import { deleteImages, saveImage, saveImages } from 'src/shared/utils/image';
import { InventoryRecordService } from 'src/inventory/services/inventory-record.service';
import {
  Action,
  EditedBy,
} from 'src/inventory/schemas/inventory-record.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly inventoryService: InventoryRecordService,
  ) {}

  async findAll(queryParams: ProductQueryDto, selectObject: any = { __v: 0 }) {
    const {
      order = Order.Desc,
      limit = 5,
      page = 1,
      title,
      sort,
      category,
      url,
      exclude,
    } = queryParams;

    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (url) {
      query.url = { $regex: url, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (exclude?.length) {
      query._id = { $nin: exclude };
    }

    const orderOption = getOrderOption(order);
    const sortObject = getProductSortOption(orderOption, sort);

    const products = await this.productModel
      .find(query)
      .populate('category', { title: 1 })
      .sort(sortObject)
      .select(selectObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const count = await this.productModel.countDocuments(query);

    return { count, products };
  }

  async findOne(id: string, selectObject: any = { __v: 0 }) {
    const product = await this.productModel
      .findOne({ _id: id })
      .populate('category', { title: 1 })
      .select(selectObject)
      .exec();
    if (product) {
      return product;
    } else {
      throw new NotFoundException();
    }
  }

  async findOneWithUrl(url: string, selectObject: any = { __v: 0 }) {
    const product = await this.productModel
      .findOne({ url: url })
      .populate('category', { title: 1 })
      .select(selectObject)
      .exec();
    if (product) {
      return product;
    } else {
      throw new NotFoundException();
    }
  }

  async create(body: ProductDto) {
    const newProduct = new this.productModel(body);
    await newProduct.save();
    return newProduct;
  }

  async update(id: string, body: UpdateProductDto) {
    return await this.productModel.findByIdAndUpdate(id, body, {
      returnDocument: `after`,
    });
  }

  async delete(id: string) {
    const product = await this.findOne(id);

    for (const image of product?.images) {
      await deleteImages([image]);
    }
    await product.deleteOne();

    return product;
  }
  async uploadImages(id: string, images: Array<Express.Multer.File>) {
    const product = await this.findOne(id);
    const imagesPath = await saveImages(images, `products/images`);
    product.images = imagesPath;
    await product.save();
    return { message: `images uploaded successfully` };
  }
  async uploadThumbnail(id: string, thumbnail: Express.Multer.File) {
    const product = await this.findOne(id);
    const imagePath = await saveImage(thumbnail, `products/thumbnail`);
    product.thumbnail = imagePath;
    await product.save();
    return { message: `thumbnail uploaded successfully`, product };
  }
  async deleteThumb(id: string, path: string) {
    const product = await this.findOne(id);
    if (product.thumbnail !== path) {
      throw new NotFoundException(`no thumbnail was found for this product`);
    }
    await deleteImages([path]);
    product.thumbnail = ``;
    await product.save();
    return { message: `thumbnail deleted successfully`, product };
  }
  async addStock(
    id: string,
    quantity: number,
    editedBy: EditedBy,
    order?: string,
  ) {
    const product = await this.findOne(id);
    const oldStock = product.stock || 0;
    product.stock = oldStock + quantity;
    await product.save();
    await this.inventoryService.createInventory({
      action: Action.Add,
      editedBy,
      quantity,
      product: id,
      order,
    });
    return product;
  }
  async removeStock(
    id: string,
    quantity: number,
    editedBy: EditedBy,
    order?: string,
  ) {
    const product = await this.findOne(id);
    const oldStock = product.stock || 0;
    if (oldStock === 0) {
      throw new BadRequestException(`the stock of ${product.title} is 0`);
    }
    if (oldStock < quantity) {
      throw new BadRequestException(
        `quantity must not be more than current stock`,
      );
    }
    product.stock = oldStock - quantity;
    await product.save();
    await this.inventoryService.createInventory({
      action: Action.Remove,
      editedBy,
      quantity,
      product: id,
      order,
    });
    return product;
  }
  async deleteImages(id: string, paths: string[]) {
    const product = await this.findOne(id);
    if (product.images.length === 0) {
      throw new NotFoundException(`no images were found for this product`);
    }
    const imagesToDelete = product.images.filter((item) =>
      paths.includes(item),
    );
    await deleteImages(imagesToDelete);
    product.images = product.images.filter((item) => !paths.includes(item));
    await product.save();

    return { message: `images deleted successfully`, product };
  }
}
