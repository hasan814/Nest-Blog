import { swaggerConfigInit } from './config/swagger.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
