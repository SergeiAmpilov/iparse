import { App } from "./app";
import { ArticlesController } from "./articles/articles.comtroller";
import { LoggerService } from "./logger/logger.service";
import { MainPageController } from "./main-page/mainpage.controller";


async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new ArticlesController(logger),
    new MainPageController(logger),
  );
  await app.init();
}

bootstrap();