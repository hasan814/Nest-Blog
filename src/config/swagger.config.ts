import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { INestApplication } from "@nestjs/common"

export const swaggerConfigInit = (app: INestApplication): void => {
  const document = new DocumentBuilder()
    .setTitle("Blog")
    .setDescription('Backend of blog website')
    .setVersion("v0.0.1")
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, document)
  SwaggerModule.setup("swagger", app, swaggerDocument)
}