import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = config.PORT || 3000;

  const configDoc = new DocumentBuilder()
    .setTitle('NEST_BASE')
    .setDescription('Nest API description')
    .setVersion('1.0')
    .addTag('Nest')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configDoc);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  Logger.log(`Nest-base API is running on: http://localhost:${port}`);
  Logger.log(`Nest-base DOCS is running on: http://localhost:${port}/docs`);
}
bootstrap();
