import { Module } from '@nestjs/common';
import { SeoController } from './controllers/seo.controller';
import { SeoService } from './services/seo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Seo, SeoSchema } from './schemas/seo.schema';
import { SiteSeoController } from './controllers/site-seo.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Seo.name,
        schema: SeoSchema,
      },
    ]),
  ],
  controllers: [SeoController, SiteSeoController],
  providers: [SeoService],
})
export class SeoModule {}
