import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { ArticleModel } from "../articles/Article.model";
import { trunc } from "../functions/Truncate.function";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import 'reflect-metadata';


@injectable()
export class MainPageController extends BaseController {
  constructor(
    @inject(TYPES.ILogger) logger: LoggerService,
    ) {
    super(logger);
    this.bindRoutes([
      { method: 'get', path: '/', func: this.renderMainPage },
    ]);
  }


  async renderMainPage(req: Request, res: Response, next: NextFunction): Promise<void> {

    const list = await ArticleModel.find().sort({'dateCreate': -1}).limit(2).exec();

    res.render('index', {
      title: 'Услуги парсинга веб-сайтов',
      description: 'Услуги по парсингу веб-сайтов под заказ',
      articles: list.map( (el) => {
        return {
          cardSlug: el.slug,
          cardDateCreate: new Date(el.dateCreate).toLocaleDateString('ru-RU'),
          cardTitle: el.title,
          cardText: trunc(el.text, 200),
          cardTags: el.tags
        };
      })
    });  

  }
}