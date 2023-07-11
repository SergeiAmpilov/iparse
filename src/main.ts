import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { ArticlesController } from "./articles/articles.comtroller";
import { ContactPageController } from "./contact-form/contacts.comtroller";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { MainPageController } from "./main-page/mainpage.controller";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { IExeptionFilter } from "./errors/exeption.filter.interface";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
  bind<ArticlesController>(TYPES.ArticlesController).to(ArticlesController);
  bind<MainPageController>(TYPES.MainPageController).to(MainPageController);
  bind<ContactPageController>(TYPES.ContactPageController).to(ContactPageController);
  bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  
  const app = appContainer.get<App>(TYPES.Application);
  app.init();

  return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
