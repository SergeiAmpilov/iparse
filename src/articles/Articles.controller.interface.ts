import { NextFunction, Request, Response, Router } from "express";

export interface IArticlesController {
  router: Router;
  renderList: (req: Request, res: Response, next: NextFunction) => void;
  renderOne: (req: Request, res: Response, next: NextFunction) => void;
  create: (req: Request, res: Response, next: NextFunction) => void;
}