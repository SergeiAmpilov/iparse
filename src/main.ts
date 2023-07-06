import { App } from "./app";
import { ArticlesController } from "./articles/articles.comtroller";
import { LoggerService } from "./logger/logger.service";


async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new ArticlesController(logger)
  );
  await app.init();
}

bootstrap();