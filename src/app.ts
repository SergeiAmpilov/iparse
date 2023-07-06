import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { engine } from 'express-handlebars';
import nodemailer from 'nodemailer';
import { ArticleDto } from './articles/Article.dto';
import { ArticleModel } from './articles/Article.model';
import { trunc } from './functions/Truncate.function';
import { ContactFormDto } from './contact-form/ContactForm.dto';
import { ContactFormModel } from './contact-form/ContactForm.model';
import { router } from './routes/router';
import { Server } from 'http';
import { IMailConfig } from './interfaces/MailConfig.interface';
import { LoggerService } from './logger/logger.service';
import { ArticlesController } from './articles/articles.comtroller';
import { MainPageController } from './main-page/mainpage.controller';
import { ContactPageController } from './contact-form/contacts.comtroller';

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


export class App {

  app: Express;
  port: number;
  server: Server;
  dbName: string;
  mailConfig: IMailConfig;
  logger: LoggerService;
  articlesController: ArticlesController;
  mainPageController: MainPageController;
  contactPageController: ContactPageController;


  constructor(
    logger: LoggerService,
    articlesController: ArticlesController,
    mainPageController: MainPageController,
    contactPageController: ContactPageController,

    ) {
    
    // dotenv.config();

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
    this.logger = logger;
    
    this.articlesController = articlesController;
    this.mainPageController = mainPageController;
    this.contactPageController = contactPageController;
    
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

  public async init() {
    await mongoose.connect(`mongodb://0.0.0.0:27017/${this.dbName}`);

    this.useBodyParse();
    this.useStatic();
    this.setRender();
    this.useRoutes();

    this.server = this.app.listen( this.port, () => {
      this.logger.log(`Server has been started at http://localhost:${this.port}/`);
    });
  }


}