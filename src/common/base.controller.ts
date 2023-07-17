import { injectable } from "inversify";
import { IControllerRoute } from "../interfaces/Route.interface";
import { LoggerService } from "../logger/logger.service";
import { Response, Router } from 'express';
import 'reflect-metadata';


@injectable()
export abstract class BaseController {

  private readonly _router: Router;

  constructor(
    private readonly logger: LoggerService,
  ) {

    this._router = Router();

  }

  get router() {
    return this._router;
  }

  protected bindRoutes(routes: IControllerRoute[]) {

    for (const route of routes) {
      
      this.logger.log(`[${route.method}] ${route.path}`);

      const middleware = route.middlewares?.map(m => m.execute.bind(m));      
      const handler = route.func.bind(this);

      const pipeline = middleware ? [...middleware, handler] : handler;
      
      this.router[route.method](
        route.path,
        pipeline
      );

    }

  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  public send<T>(res: Response, code: number = 200, msg: T) {
    return res.status(code).json(msg)
  }

  public ok<T>(res: Response, msg: T) {
    return this.send(res, 200, msg);
  }
}