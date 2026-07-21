import { Module } from '@nestjs/common';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicImage, PublicImageSchema } from './schemas/public.image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PublicImage.name,
        schema: PublicImageSchema,
      },
    ]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
