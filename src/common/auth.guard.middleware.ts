import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface";
import { HttpError } from "../errors/http-error.class";


export class AuthGuard implements IMiddleware {
  execute({ user }: Request, res: Response, next: NextFunction) {

    if (user) {
      return next();
    } else {
      return next( new HttpError(401, 'not authorized', 'AuthGuard'));
    }

  };
}