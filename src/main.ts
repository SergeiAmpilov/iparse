import { App } from "./app";
import { ArticlesController } from "./articles/articles.comtroller";
import { ContactPageController } from "./contact-form/contacts.comtroller";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { MainPageController } from "./main-page/mainpage.controller";


async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new ArticlesController(logger),
    new MainPageController(logger),
    new ContactPageController(logger),
    new ExeptionFilter(logger)
  );
  await app.init();
}

bootstrap();