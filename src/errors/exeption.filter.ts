import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HttpError } from "./http-error.class";

export class ExeptionFilter implements IExeptionFilter {
  
  constructor(
    private readonly logger: LoggerService
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