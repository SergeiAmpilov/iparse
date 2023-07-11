import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { engine } from 'express-handlebars';
import { Server } from 'http';
import { IMailConfig } from './interfaces/MailConfig.interface';
import { MainPageController } from './main-page/mainpage.controller';
import { ContactPageController } from './contact-form/contacts.comtroller';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import 'reflect-metadata';
import { IArticlesController } from './articles/Articles.controller.interface';

dotenv.config();

export const mailConfigObject: IMailConfig = {
  host: 'smtp.spaceweb.ru',
  port: 465,
  secure: true,
  auth: {
      user: 'info@iparse.tech',
      pass: process.env?.EMAIL_PASSWORD ?? '',
  },
}

@injectable()
export class App {

  app: Express;
  port: number;
  server: Server;
  dbName: string;
  mailConfig: IMailConfig;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IArticlesController) private articlesController: IArticlesController,
    @inject(TYPES.MainPageController) private mainPageController: MainPageController,
    @inject(TYPES.ContactPageController) private contactPageController: ContactPageController,
    @inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,

    ) {
    
    this.app = express();
    this.port = process.env?.PORT ? Number(process.env.PORT) : 3002;
    this.dbName = process.env?.DB_NAME ? process.env.DB_NAME : 'iparsebd';
    this.mailConfig = {
      host: 'smtp.spaceweb.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'info@iparse.tech',
        pass: process.env?.EMAIL_PASSWORD ?? '',
      },
    };    
  }

  useRoutes() {
    this.app.use(this.mainPageController.router);
    this.app.use(this.articlesController.router);
    this.app.use(this.contactPageController.router);
  }

  useBodyParse() {
    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    this.app.use(bodyParser.json())
  }

  useStatic() {
    this.app.use(
      express.static(path.join(path.dirname(__dirname), 'public' ))
    );
  }

  setRender() {
    this.app.engine('hbs', engine({
      defaultLayout: 'main',
      extname: 'hbs'
    }));
    this.app.set('view engine', 'hbs');
    this.app.set('views', './views');
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    await mongoose.connect(`mongodb://0.0.0.0:27017/${this.dbName}`);

    this.useBodyParse();
    this.useStatic();
    this.setRender();
    this.useRoutes();
    this.useExeptionFilters();

    this.server = this.app.listen( this.port, () => {
      this.logger.log(`Server has been started at http://localhost:${this.port}/`);
    });
  }


}