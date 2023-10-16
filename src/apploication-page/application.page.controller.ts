import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { NextFunction, Request, Response } from "express";




@injectable()
export class ApplicationPage extends BaseController {
  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/application',
        method: 'get',
        func: this.render
      },
    ]);
  }


  render(request: Request, res: Response, next: NextFunction) {
    return res.render('application', {
      title: 'Parser light - бесплатное приложение для сбора данных в интернет',
      description: 'Скачайте исходный код парсера для автоматизации сбора данных в интернете'
    });
  }
}