import { NestExpressApplication } from '@nestjs/platform-express';
import { swaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  swaggerConfigInit(app)
  app.useStaticAssets("public")
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser(process.env.COOKIE_SECRET))
  const { PORT } = process.env
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
    console.log(`Swagger: http://localhost:${PORT}/swagger`)
  });
}
bootstrap();
