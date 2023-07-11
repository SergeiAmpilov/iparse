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
    
    if (err instanceof HttpError) {
      this.logger.error(`[${err.context}] Ошибка (${err.statusCode}) ${err.message}`);

      res.status(err.statusCode).send({
        error: err.message
      })

    } else {
      this.logger.error(`${err.message}`);

      res.status(500).send({
        error: err.message
      })
    }
    
  }

}