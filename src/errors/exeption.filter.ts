import { NextFunction, Request, Response } from "express";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HttpError } from "./http-error.class";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import 'reflect-metadata';


@injectable()
export class ExeptionFilter implements IExeptionFilter {
  
  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
  ) {
    this.logger.log(`[ExeptionFilter]`)
  }

  catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {

    console.log('catch error');
    
    if (err instanceof HttpError) {
      this.logger.error(`[${err.context}] Ошибка (${err.statusCode}) ${err.message}`);

      // res.status(err.statusCode).send({
      //   error: err.message
      // });

      res.status(err.statusCode).render('404', {
        title: 'Произошла ошибка',
        description: 'Произошла ошибка 404 - не найдено',
      })

    } else {
      this.logger.error(`${err.message}`);

      res.status(500).send({
        error: err.message
      })
    }
    
  }

}