import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from "inversify";
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { NextFunction, Request, Response } from "express";
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface';
import { HttpError } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';



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
        middlewares: [
          new ValidateMiddleware(UserRegisterDto)
        ]
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

    const resValidate = await this.usersService.validateUser({ email, password });

    if (resValidate) {
      res.send({
        ok: 'login'
      });
    } else {
      return next(new HttpError(401, 'Not authorized', 'UsersController'));
    }   
    
  }

  async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
    
    const newUser =  await this.usersService.createUser(body);
    

    if (!newUser) {
      return next(new HttpError(422, 'This user allready exists', 'UsersController'));
    }

    this.ok(res, {
      ok: newUser.email
    });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256'
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token as string)
          }
        });
    })
  }

}