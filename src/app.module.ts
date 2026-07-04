import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blog/controllers/blog/blog.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(process.env.DB_URL ?? ``),
  ],
  controllers: [AppController, BlogController],
  providers: [AppService],
})
export class AppModule {}
