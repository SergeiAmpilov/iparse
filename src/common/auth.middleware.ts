import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface";
import { verify } from "jsonwebtoken";


export class AuthMiddleware implements IMiddleware {

  constructor(
    private readonly secret: string,
  ) { }
  execute(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      verify(token, this.secret, (err, payload) => {
        if (err) {
          next();
        } else if (typeof payload !== 'string' ) {
          req.user = payload?.email;
          next();
        }
      })
    }
    next();
  };
}