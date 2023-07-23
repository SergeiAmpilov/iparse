import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { ArticleModel } from "./Article.model";
import { trunc } from "../functions/Truncate.function";
import { ArticleDto } from "./Article.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import 'reflect-metadata';
import { IArticlesController } from "./Articles.controller.interface";
import { AuthGuard } from "../common/auth.guard.middleware";


@injectable()
export class ArticlesController extends BaseController implements IArticlesController {

  constructor(
    @inject(TYPES.ILogger) logger: ILogger
    ) {    
    super(logger);
    this.bindRoutes([
      { method: 'get', path: '/articles', func: this.renderList },
      { method: 'get', path: '/articles/:slug', func: this.renderOne },
      { 
        method: 'post',
        path: '/articles',
        func: this.create,
        middlewares: [
          new AuthGuard()
        ],
      },
    ]);
  }

  async renderList(req: Request, res: Response, next: NextFunction): Promise<void> {

    const list = await ArticleModel.find({}).sort({'dateCreate': -1}).limit(8);

    res.render('articles', {
      title: 'Статьи - Парсинг веб-сайтов',
      description: 'Статьи о парсинге веб-сайтов',
      articles: list.map( (el) => {
        return {
          cardSlug: el.slug,
          cardDateCreate: new Date(el.dateCreate).toLocaleDateString('ru-RU'),
          cardTitle: el.title,
          cardText: trunc(el.text, 200),
          cardTags: el.tags
        };
      }),
    });

  }

  async renderOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const slug = req.params?.slug;
    const cardData = await ArticleModel.find({ slug });

    if (cardData[0]) {
    
      res.render(`articles/${slug}`, {
        title: cardData[0].title,
        description: `Статья ${cardData[0].title}`,
        cardTitle: cardData[0].title,
        cardSlug: slug,
        cardDateCreate: new Date(cardData[0].dateCreate).toLocaleDateString('ru-RU'),
        cardText: cardData[0].text,
        cardTags: cardData[0].tags      
      });
    }
  

  }

  async create({ body }: Request<{}, {}, ArticleDto>, res: Response): Promise<void> {
    const result = await ArticleModel.create({
      slug: body.slug,
      title: body.title,
      text: body.text,
      tags: 
        typeof body.tags === 'string'
        ? body.tags.split(',').map( e => e.trim() )
        : []
    });

    res.send({
      ok: result
    })
  }



  
}