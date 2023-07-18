import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { NextFunction, Request, Response } from "express";



@injectable()
export class CasesController extends BaseController {
  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/',
        method: 'get',
        func: this.getCasesList
      },
      {
        path: '/:slug',
        method: 'get',
        func: this.getCasesCard
      },
      {
        path: '/',
        method: 'post',
        func: this.createCase
      },
      {
        path: '/request',
        method: 'post',
        func: this.getExample
      },


    ]);
  }


  getCasesList(req: Request, res: Response, next: NextFunction) {

    res.render('cases', {
      title: 'Примеры парсинга сайтов',
      description: 'Скачайте бесплатно примеры уже собранных баз данных',
      casesList: [1,2,3]
    });

    
  }

  getCasesCard(req: Request, res: Response, next: NextFunction) {
    
    res.render('casesdetail', {
      title: 'Примеры парсинга сайтов',
      description: 'Скачайте бесплатно примеры уже собранных баз данных',
      slug: req.params?.slug
    });

    // res.send({
    //   ok: `getCasesCard ${req.params?.slug}`
    // });
  }

  createCase(req: Request, res: Response, next: NextFunction) {
    res.send({
      ok: 'createCase',
    });
  }

  getExample({ body }: Request, res: Response, next: NextFunction) {

    
    res.send({
      ok: `get example by slug ${body?.slug}`,
    });

  }

}