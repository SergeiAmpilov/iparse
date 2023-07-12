import 'reflect-metadata';
import { injectable } from "inversify";
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';


@injectable()
export class SitemapService {

  async create(): Promise<void> {
    console.log('sitemap service');
  }

}