import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RedirectMiddleware } from "./middlewares/redirect.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Ecommerce Api Documentation")
    .setDescription("Ecommerce Api Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  app.use(new RedirectMiddleware().use);
  app.use(morgan("dev"));
  app.use(loggerMiddleware);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}

bootstrap();
