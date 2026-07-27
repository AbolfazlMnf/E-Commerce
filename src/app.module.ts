import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { TimeMiddleware } from './shared/middlewares/time.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LogInterceptor } from './shared/interceptors/log.interceptor';
import { Log, LogSchema } from './shared/schemas/log.schema';
import { GlobalExceptionFilter } from './shared/filters/log.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { IdPipe } from './shared/pipes/id.pipe';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { SeoModule } from './seo/seo.module';
import { ProductModule } from './product/product.module';
import { TicketModule } from './ticket/ticket.module';
import { ShopModule } from './shop/shop.module';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from './redis/redis.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    BlogModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(process.env.DB_URL ?? ``),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Log.name,
        schema: LogSchema,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, `..`, `files`),
      serveRoot: `/files`,
    }),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +(process?.env?.REDIS_PORT ?? `3000`),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    SeoModule,
    ProductModule,
    TicketModule,
    ShopModule,
    RedisModule,
    CommentModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeMiddleware).forRoutes(`*`);
  }
}
