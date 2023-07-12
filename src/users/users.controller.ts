import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from "inversify";
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { NextFunction, Request, Response } from "express";




@injectable()
export class UserController extends BaseController implements IUserController {

  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        method: 'post',
        path: '/register',
        func: this.register,
      },
      {
        method: 'post',
        path: '/login',
        func: this.login,
      }

    ]);

  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {

  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {

  }
  

}