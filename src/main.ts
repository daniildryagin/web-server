import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    }
  ));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('')
    .setVersion('1.0')
    .addTag('')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, () => console.log(`Server started on port ${port}`));
}
bootstrap();