import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ApikeyGuard } from './shared/guards/apikey.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // app.useGlobalGuards(new ApikeyGuard());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for the E-Commerce project')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/documentation`, app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
