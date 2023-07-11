import { Container } from "inversify";
import { App } from "./app";
import { ArticlesController } from "./articles/articles.comtroller";
import { ContactPageController } from "./contact-form/contacts.comtroller";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { MainPageController } from "./main-page/mainpage.controller";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { IExeptionFilter } from "./errors/exeption.filter.interface";


const appContainer = new Container();
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
appContainer.bind<ArticlesController>(TYPES.ArticlesController).to(ArticlesController);
appContainer.bind<MainPageController>(TYPES.MainPageController).to(MainPageController);
appContainer.bind<ContactPageController>(TYPES.ContactPageController).to(ContactPageController);
appContainer.bind<App>(TYPES.Application).to(App);

const app = appContainer.get<App>(TYPES.Application);
app.init();

export {
  app,
  appContainer
};