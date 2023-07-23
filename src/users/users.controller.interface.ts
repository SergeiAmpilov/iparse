import { NextFunction, Request, Response } from "express";
import { IBaseController } from "../common/base.controller.interface";

export interface IUserController extends IBaseController {
  login: (req: Request, res: Response, next: NextFunction) => void;
  register: (req: Request, res: Response, next: NextFunction) => void;
  info: (req: Request, res: Response, next: NextFunction) => void;
}