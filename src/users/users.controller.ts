import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from "inversify";
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { NextFunction, Request, Response } from "express";
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';




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
      },
    ]);

  }

  async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    
    console.log(email, password);
    res.send({
      ok: 'login'
    });
    
  }

  async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
    const newUser = new User(body.email, body.name);
    await newUser.setPassword(body.password);

    this.ok<{ok: User}>(res, {
      ok: newUser
    });
  }  

}