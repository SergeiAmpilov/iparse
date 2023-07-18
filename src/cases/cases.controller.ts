import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { NextFunction, Request, Response } from "express";
import { CaseModel } from "./cases.model";
import { HttpError } from "../errors/http-error.class";
import { trunc } from "../functions/Truncate.function";
import nodemailer from 'nodemailer';
import { mailConfigObject } from "../app";
import path from 'path';




@injectable()
export class CasesController extends BaseController {
  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/',
        method: 'get',
        func: this.getCasesList
      },
      {
        path: '/:slug',
        method: 'get',
        func: this.getCasesCard
      },
      {
        path: '/',
        method: 'post',
        func: this.createCase
      },
      {
        path: '/request',
        method: 'post',
        func: this.getExample
      },


    ]);
  }


  async getCasesList(req: Request, res: Response, next: NextFunction): Promise<void> {

    const list = await CaseModel.find({}).sort({'dateCreate': -1}).limit(18);

    const casesList = list.map( (el) => {
      const { slug, name, description } = el;
      return {
        slug,
        name,
        description: trunc(description, 200),
      };
    })

    res.render('cases', {
      title: 'Примеры парсинга сайтов',
      description: 'Скачайте бесплатно примеры уже собранных баз данных',
      casesList,
    });

    
  }

  async getCasesCard({ params }: Request, res: Response, next: NextFunction): Promise<void> {

    const { slug } = params;
    const cardData = await CaseModel.find({ slug });

    if (cardData[0]) {
      res.render('casesdetail', {
        title: `Примеры парсинга - ${cardData[0].name}`,
        description: `Скачайте бесплатно примеры уже собранных баз данных - ${cardData[0].name}`,
        slug,
        name: cardData[0].name,
        text: cardData[0].description,
      });
    }    

  }

  async createCase({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    
    const { slug, name, description } = body;

    const result = await CaseModel.create({ slug, name, description });

    if (result) {
      res.send({
        ok: result,
      });
    } else {
      next( new HttpError(500, 'cannot create new case'));
    }

  }

  async getExample({ body }: Request, res: Response, next: NextFunction): Promise<void> {

    const { slug, email } = body;
    const fileAdres = path.join(
      `${path.dirname(path.dirname(__dirname))}/`,
      `/public/cases/${slug}/data.xls`
    );
        

    console.log(
      'send email example with',
      slug,
      email,
      fileAdres
    );
    
    let transporter = nodemailer.createTransport(mailConfigObject);

    try {

      await transporter.sendMail({
        from: '"iparse.tech admin" <info@iparse.tech>',
        to: email,
        subject: 'Пример базы данных парсинга',
        text: 'Здравствуйте! Подготовили для Вас выгрузку базы данных - она в прикреплении к письму.',
        html: `<b>Здравствуйте!</b><br>Подготовили для Вас выгрузку базы данных - она в прикреплении к письму.`,
        attachments: [
          {
            filename: 'data.xls',
            content: 'Parsed data',
            path: fileAdres,
          }
        ],
      });

    } catch(e: any) {
      next( new HttpError(500, 'ошибка отправки email-сообщения', 'ContactPageController') );
    }




    
    res.send({
      ok: `get example by slug ${body?.slug}`,
    });

  }

}