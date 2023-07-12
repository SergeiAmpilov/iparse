import { NextFunction, Request, Response } from "express";

export interface ISitemapController {
  createSitemap: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}