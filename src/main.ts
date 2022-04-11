import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages:
        process.env.NODE_ENV === 'production' ? true : false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // allow conversion underneath
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Flint API')
    .setDescription('The Flint API description')
    .setVersion('1.0')
    .addTag('default')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8080);
}
bootstrap();
