import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PublicImage } from '../schemas/public.image.schema';
import { Model } from 'mongoose';
import { deleteImages, saveImage } from 'src/shared/utils/image';
import { ImageQueryDto } from '../dtos/image-query.dto';
import { getSortOption } from 'src/shared/utils/sort';
import { sortOrder } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(PublicImage.name)
    private readonly publicImageModel: Model<PublicImage>,
  ) {}

  async findAll(queries: ImageQueryDto) {
    const { page = 1, limit = 5, sort, order = sortOrder.Desc } = queries;
    const orderOption = getOrderOption(order);
    const sortOption = getSortOption(orderOption, sort);
    const [images, count] = await Promise.all([
      this.publicImageModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption)
        .exec(),
      this.publicImageModel.countDocuments().exec(),
    ]);
    return { images, count };
  }

  async saveImage(file: Express.Multer.File, folder?: string) {
    const path = await saveImage(file, folder ?? `general`);
    const newImage = new this.publicImageModel({ image: path });
    await newImage.save();
    return newImage;
  }
  async findOneImage(id: string) {
    const image = await this.publicImageModel.findById(id);
    if (!image) {
      throw new NotFoundException();
    }
    return image;
  }
  async deleteImage(id: string) {
    const image = await this.findOneImage(id);
    await deleteImages([image.image]);
    await image.deleteOne();
    return { message: `image deleted` };
  }
}
