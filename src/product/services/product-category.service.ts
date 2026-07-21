import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductCategoryDto } from '../dtos/product-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCategory } from '../schemas/product-category.schema';
import { Model } from 'mongoose';
import { ProductCategoryQueryDto } from '../dtos/product-category-query.dto';
import { UpdateProductCategoryDto } from '../dtos/update-product-category.dto';
import { deleteImages, saveImage } from 'src/shared/utils/image';
import { getOrderOption } from 'src/shared/utils/order';
import { sortOrder } from 'src/shared/dtos/query.dto';
import { getSortOption } from 'src/shared/utils/sort';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name)
    private readonly productCategoryModel: Model<ProductCategory>,
  ) {}

  async findAll(
    queryParams: ProductCategoryQueryDto,
    selectObject: any = { __v: 0 },
  ) {
    const {
      limit = 5,
      page = 1,
      title,
      sort,
      url,
      order = sortOrder.Desc,
    } = queryParams;

    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (url) {
      query.url = { $regex: url, $options: 'i' };
    }

    const orderOption = getOrderOption(order);
    const sortObj = getSortOption(orderOption, sort);

    const productCategories = await this.productCategoryModel
      .find(query)
      .sort(sortObj)
      .select(selectObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const count = await this.productCategoryModel.countDocuments(query);

    return { count, productCategories };
  }

  async findOne(id: string, selectObject: any = { __v: 0 }) {
    const productCategory = await this.productCategoryModel
      .findOne({ _id: id })
      .select(selectObject)
      .exec();
    if (productCategory) {
      return productCategory;
    } else {
      throw new NotFoundException();
    }
  }

  async findOneWithUrl(url: string, selectObject: any = { __v: 0 }) {
    const productCategory = await this.productCategoryModel
      .findOne({ url: url })
      .select(selectObject)
      .exec();
    if (productCategory) {
      return productCategory;
    } else {
      throw new NotFoundException();
    }
  }

  async create(body: ProductCategoryDto) {
    const newProductCategory = new this.productCategoryModel(body);
    await newProductCategory.save();
    return newProductCategory;
  }

  async update(id: string, body: UpdateProductCategoryDto) {
    return await this.productCategoryModel.findByIdAndUpdate(id, body, {
      returnDocument: `after`,
    });
  }

  async delete(id: string) {
    const productCategory = await this.findOne(id);

    await deleteImages([productCategory.image]);
    await productCategory.deleteOne();

    return productCategory;
  }
  async uploadImage(id: string, image: Express.Multer.File) {
    const productCategory = await this.findOne(id);
    const imagePath = await saveImage(image, `products/thumbnail`);
    productCategory.image = imagePath;
    await productCategory.save();
    return { message: `image uploaded successfully`, productCategory };
  }
  async deleteImage(id: string, path: string) {
    const productCategory = await this.findOne(id);
    if (productCategory.image !== path) {
      throw new NotFoundException(`no thumbnail was found for this product`);
    }
    await deleteImages([path]);
    productCategory.image = ``;
    await productCategory.save();
    return { message: `thumbnail deleted successfully`, productCategory };
  }
}
