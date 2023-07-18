import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { NextFunction, Request, Response } from "express";
import { CaseModel } from "./cases.model";
import { HttpError } from "../errors/http-error.class";
import { trunc } from "../functions/Truncate.function";



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


  async getCasesList(req: Request, res: Response, next: NextFunction): Promise<void> {

    const list = await CaseModel.find({}).sort({'dateCreate': -1}).limit(18);

    const casesList = list.map( (el) => {
      const { slug, name, description } = el;
      return {
        slug,
        name,
        description: trunc(description, 200),
      };
    })

    res.render('cases', {
      title: 'Примеры парсинга сайтов',
      description: 'Скачайте бесплатно примеры уже собранных баз данных',
      casesList,
    });

    
  }

  async getCasesCard({ params }: Request, res: Response, next: NextFunction): Promise<void> {

    const { slug } = params;
    const cardData = await CaseModel.find({ slug });

    if (cardData[0]) {
      res.render('casesdetail', {
        title: `Примеры парсинга - ${cardData[0].name}`,
        description: `Скачайте бесплатно примеры уже собранных баз данных - ${cardData[0].name}`,
        slug,
        name: cardData[0].name,
        text: cardData[0].description,
      });
    }    

  }

  async createCase({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    
    const { slug, name, description } = body;

    const result = await CaseModel.create({ slug, name, description });

    if (result) {
      res.send({
        ok: result,
      });
    } else {
      next( new HttpError(500, 'cannot create new case'));
    }

  }

  getExample({ body }: Request, res: Response, next: NextFunction) {

    
    res.send({
      ok: `get example by slug ${body?.slug}`,
    });

  }

}