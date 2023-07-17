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
import { IUsersService } from './users.service.interface';
import { HttpError } from '../errors/http-error.class';




@injectable()
export class UserController extends BaseController implements IUserController {

  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
    @inject(TYPES.IUsersService) private readonly usersService: IUsersService
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        method: 'post',
        path: '/register',
        func: this.register,
        middlewares: []
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
    
    const newUser =  await this.usersService.createUser(body);
    

    if (!newUser) {
      return next(new HttpError(422, 'This user allready exists'));
    }

    this.ok(res, {
      ok: newUser.email
    });


  }  

}