import express, { Express, NextFunction, Request, Response, Router } from 'express';
import { ArticleModel } from '../articles/Article.model';
import { trunc } from '../functions/Truncate.function';
import { ArticleDto } from '../articles/Article.dto';
import { ContactFormDto } from '../contact-form/ContactForm.dto';
import { ContactFormModel } from '../contact-form/ContactForm.model';
import nodemailer from 'nodemailer';
import { mailConfigObject } from '../functions/Mail.config';






export const router: Router = express.Router();



router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const list = await ArticleModel.find({}).sort({'dateCreate': -1}).limit(2);  

  res.render('index', {
    title: 'Услуги парсинга веб-сайтов',
    description: 'Услуги по парсингу веб-сайтов под заказ',
    articles: list.map( (el) => {
      return {
        cardSlug: el.slug,
        cardDateCreate: new Date(el.dateCreate).toLocaleDateString('ru-RU'),
        cardTitle: el.title,
        cardText: trunc(el.text, 200),
        cardTags: el.tags
      };
    })
  });
});


router.get('/articles/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const slug = req.params?.slug;
  const cardData = await ArticleModel.find({ slug });

  if (cardData[0]) {
    
    res.render(`articles/${slug}`, {
      title: cardData[0].title,
      description: `Статья ${cardData[0].title}`,
      cardTitle: cardData[0].title,
      cardSlug: slug,
      cardDateCreate: new Date(cardData[0].dateCreate).toLocaleString(),
      cardText: cardData[0].text,
      cardTags: cardData[0].tags      
    });
  }
});

router.get('/articles', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const list = await ArticleModel.find({}).sort({'dateCreate': -1}).limit(8);  

  res.render('articles', {
    title: 'Статьи - Парсинг веб-сайтов',
    description: 'Статьи о парсинге веб-сайтов',
    articles: list.map( (el) => {
      return {
        cardSlug: el.slug,
        cardDateCreate: new Date(el.dateCreate).toLocaleString(),
        cardTitle: el.title,
        cardText: trunc(el.text, 200),
        cardTags: el.tags
      };
    }),
  });
});

router.post('/articles', async ({ body }: Request<{}, {}, ArticleDto>, res: Response): Promise<void> => {

  const result = await ArticleModel.create({
    slug: body.slug,
    title: body.title,
    text: body.text,
    tags: 
      typeof body.tags === 'string'
      ? body.tags.split(',').map( e => e.trim() )
      : []
  });
 
  res.send({
    ok: result
  })
});


router.post('/contact-form', async ({ body }: Request<{}, {}, ContactFormDto>, res: Response): Promise<void> => {
  
  const { name, email, description } = body;

  const createResult = await ContactFormModel.create({
    name,
    email,
    description
  });

  let transporter = nodemailer.createTransport(mailConfigObject);

  await transporter.sendMail({
    from: '"iparse.tech admin" <info@ampilovs.ru>',
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
});