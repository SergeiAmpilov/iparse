import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import 'reflect-metadata';
import { NextFunction, Request, Response } from "express";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { ISitemapController } from "./sitemap.interface";
import { SitemapService } from "./sitemap.service";


@injectable()
export class SitemapController extends BaseController implements ISitemapController {

  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
    @inject(TYPES.SitemapService) private readonly sitemapService: SitemapService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        method: 'post',
        path: '/sitemap',
        func: this.createSitemap
      }
    ]);
  }


  async createSitemap(req: Request, res: Response, next: NextFunction): Promise<void> {

    // const smStream = new SitemapStream({ hostname: 'https://iparse.tech/' });
    // const pipeline = smStream.pipe(createGzip());

    await this.sitemapService.create();



    res.send({
      createSitemap: 'ok'
    });
  }


}