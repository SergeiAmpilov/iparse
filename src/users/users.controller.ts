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
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard.middleware';



@injectable()
export class UserController extends BaseController implements IUserController {

  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
    @inject(TYPES.IUsersService) private readonly usersService: IUsersService,
    @inject(TYPES.IConfigService) private readonly configService: IConfigService,
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
      {
        method: 'get',
        path: '/info',
        func: this.info,
        middlewares: [
          new AuthGuard()
        ],
      },
    ]);

  }

  async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    const resValidate = await this.usersService.validateUser({ email, password });

    if (resValidate) {
      
      const secret = this.configService.get('SECRET');
      if (secret) {
        const jwt = await this.signJWT(email, secret as string);
        res.send({ jwt });

      }

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

  async info({ user }: Request, res: Response, next: NextFunction) {
    const userFound = await this.usersService.getUserInfo(user);
    this.ok(res, {
      user: userFound,
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