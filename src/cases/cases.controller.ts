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
        path: '/cases',
        method: 'get',
        func: this.getCasesList
      },
      {
        path: '/cases/:slug',
        method: 'get',
        func: this.getCasesCard
      },
      {
        path: '/cases',
        method: 'post',
        func: this.createCase
      },

    ]);
  }


  getCasesList(req: Request, res: Response, next: NextFunction) {
    res.send({
      ok: 'getCasesList'
    });

  }

  getCasesCard(req: Request, res: Response, next: NextFunction) {
    res.send({
      ok: `getCasesCard ${req.params?.slug}`
    });
  }

  createCase(req: Request, res: Response, next: NextFunction) {
    res.send({
      ok: 'createCase'
    });
  }

}