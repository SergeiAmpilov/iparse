import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { NextFunction, Request, Response } from 'express';
import { ContactFormDto } from "./ContactForm.dto";
import { ContactFormModel } from "./ContactForm.model";
import nodemailer from 'nodemailer';
import { mailConfigObject } from "../app";




export class ContactPageController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);

    this.bindRoutes([
      { method: 'get', path: '/contacts', func: this.renderContactPage },
      { method: 'post', path: '/contact-form', func: this.sendContactForm },
    ]);
  }


  renderContactPage(req: Request, res: Response, next: NextFunction) {
    res.render('contacts');
  }

  async sendContactForm({ body }: Request<{}, {}, ContactFormDto>, res: Response, next: NextFunction) {
    const { name, email, description } = body;

    const createResult = await ContactFormModel.create({
      name,
      email,
      description
    });

  let transporter = nodemailer.createTransport(mailConfigObject);

  await transporter.sendMail({
    from: '"iparse.tech admin" <info@iparse.tech>',
    to: 'dev@ampilovs.ru',
    subject: 'New message from contact form',
    text: `name: ${name}, email: ${email}, description: ${description}`,
    html:
        'This <i>message</i> was sent from <strong>Node js</strong> server.' + 
        `<br><b>name:</b><br>${name}<br><b>email:</b><br>${email}<br><b>description:</b><br>${description}`,
  });

  res.send({
    ok: {
      name,
      email,
      description
    }
  });


  }
}