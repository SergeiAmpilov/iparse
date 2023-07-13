import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import 'reflect-metadata';
import { ILogger } from "../logger/logger.interface";
import { NextFunction, Request, Response } from "express";
import { TYPES } from "../types";



@injectable()
export class Page404Controller extends BaseController {

  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        method: 'get',
        path: '*',
        func: this.render404,
      }
    ]);
  }

  render404(req: Request, res: Response, next: NextFunction): void {
    res.status(404).render('404', {
      title: 'Произошла ошибка',
      description: 'Произошла ошибка 404 - не найдено',
    })
  }
}