import 'reflect-metadata';
import { injectable } from "inversify";
import xml from "xml";
import { promises as fs } from 'fs';
import path from 'path';



@injectable()
export class SitemapService {

  async create(): Promise<void> {
    
    console.log('sitemap service');
    const baseDomain = 'https://iparse.tech/';

    const urlList: IndexUrl[] = [
      {
        loc: 'articles',
        lastmod: '2023-07-01',
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        loc: 'articles/parsit-chuzhie-sajty-eto-voobshche-zakonno',
        lastmod: '2023-06-30',
        changefreq: 'yearly',
        priority: 0.6
      },
      {
        loc: 'articles/chto-takoe-parsing-i-chto-o-nyom-neobhodimo-znat',
        lastmod: '2023-06-29',
        changefreq: 'yearly',
        priority: 0.6
      },
      {
        loc: 'contacts',
        lastmod: '2023-07-01',
        changefreq: 'yearly',
        priority: 0.7
      },
    ];



    const sitemapItems = urlList.map((element) => {
      return {
        url: [
          {loc: `${baseDomain}${element.loc}`},
          {lastmod: element.lastmod ? element.lastmod : new Date().toISOString().split("T")[0]},
          {changefreq: element.changefreq ?? 'monthly'},
          {priority: element.priority ?? 0.6},
        ],
      };
    });

    

    const indexItem = {
      url: [
        { loc: "https://iparse.tech/",  },
        { lastmod: '2023-07-01', },
        { changefreq: "monthly" },
        { priority: "1.0" },
      ],
    };

    const sitemapObject = {
      urlset: [
        {
          _attr: {
            xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
          },
        },
        indexItem,
        ...sitemapItems,
      ],
    };

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>${xml(sitemapObject)}`;

   

    await fs.writeFile(path.join(path.dirname(path.dirname(__dirname)), 'public/sitemap.xml'), sitemap, 'utf8');
    console.log('sitemap service - done');

  }

}






type IndexUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}


