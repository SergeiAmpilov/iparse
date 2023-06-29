import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { engine } from 'express-handlebars';

import { ArticleDto } from './articles/Article.dto';
import { ArticleModel } from './articles/Article.model';
import { trunc } from './functions/Truncate.function';
import { ContactFormDto } from './contact-form/ContactForm.dto';
import { ContactFormModel } from './contact-form/ContactForm.model';

dotenv.config();
const { PORT = 3002}  = process.env;
const { DB_NAME = 'iparsebd'}  = process.env;



const app: Express = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(
  express.static(path.join(path.dirname(__dirname), 'public' ))
);

app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const list = await ArticleModel.find({}).sort({'dateCreate': -1}).limit(2);  

  res.render('index', {
    title: 'Услуги парсинга веб-сайтов',
    description: 'Услуги по парсингу веб-сайтов под заказ',
    articles: list.map( (el) => {
      return {
        cardSlug: el.slug,
        cardDateCreate: new Date(el.dateCreate).toLocaleString(),
        cardTitle: el.title,
        cardText: trunc(el.text, 60),
        cardTags: el.tags
      };
    })
  });
});


app.get('/articles/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const slug = req.params?.slug;
  const cardData = await ArticleModel.find({ slug });

  if (cardData[0]) {
    res.render('articledetail', {
      title: cardData[0].title,
      description: `Статья ${cardData[0].title}`,
      cardTitle: cardData[0].title,
      cardDateCreate: new Date(cardData[0].dateCreate).toLocaleString(),
      cardText: cardData[0].text,
      cardTags: cardData[0].tags      
    });
  }
});

app.get('/articles', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const list = await ArticleModel.find({}).sort({'dateCreate': -1}).limit(8);  

  res.render('articles', {
    title: 'Статьи - Парсинг веб-сайтов',
    description: 'Статьи о парсинге веб-сайтов',
    articles: list.map( (el) => {
      return {
        cardSlug: el.slug,
        cardDateCreate: new Date(el.dateCreate).toLocaleString(),
        cardTitle: el.title,
        cardText: trunc(el.text, 60),
        cardTags: el.tags
      };
    }),
  });
});

app.post('/articles', async ({ body }: Request<{}, {}, ArticleDto>, res: Response): Promise<void> => {

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


app.post('/contact-form', async ({ body }: Request<{}, {}, ContactFormDto>, res: Response): Promise<void> => {
  
  const { name, email, description } = body;
  

  const createResult = await ContactFormModel.create({
    name,
    email,
    description
  });

  console.log('res create', createResult);
  
  // 2 - отправляем емайл администратору
  

  res.send({
    ok: {
      name,
      email,
      description
    }
  });
});


async function start() {
  await mongoose.connect(`mongodb://0.0.0.0:27017/${DB_NAME}`);

  app.listen(PORT, () => {
    console.log(`Server has been started at http://localhost:${PORT}/`);
  })
}

start();