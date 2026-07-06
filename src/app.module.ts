import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { TimeMiddleware } from './shared/middlewares/time.middleware';

@Module({
  imports: [
    BlogModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(process.env.DB_URL ?? ``),
    BlogCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeMiddleware).forRoutes(`*`);
  }
}
