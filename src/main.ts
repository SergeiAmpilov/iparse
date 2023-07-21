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
import { IArticlesController } from "./articles/Articles.controller.interface";
import { SitemapController } from "./sitemap/sitemap.controller";
import { ISitemapController } from "./sitemap/sitemap.interface";
import { SitemapService } from "./sitemap/sitemap.service";
import { IUserController } from "./users/users.controller.interface";
import { UserController } from "./users/users.controller";
import { Page404Controller } from "./page404/page404.controller";
import { CasesController } from "./cases/cases.controller";
import { IUsersService } from "./users/users.service.interface";
import { UserService } from "./users/users.service";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
  bind<IArticlesController>(TYPES.IArticlesController).to(ArticlesController);
  bind<MainPageController>(TYPES.MainPageController).to(MainPageController);
  bind<ISitemapController>(TYPES.ISitemapController).to(SitemapController);
  bind<ContactPageController>(TYPES.ContactPageController).to(ContactPageController);
  bind<IUserController>(TYPES.IUserController).to(UserController);
  bind<SitemapService>(TYPES.SitemapService).to(SitemapService);
  bind<Page404Controller>(TYPES.Page404Controller).to(Page404Controller);
  bind<CasesController>(TYPES.CasesController).to(CasesController);  
  bind<IUsersService>(TYPES.IUsersService).to(UserService);  
  bind<IConfigService>(TYPES.IConfigService).to(ConfigService);    
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
