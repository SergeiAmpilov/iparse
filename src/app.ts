import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { ArticleDto } from './articles/Article.dto';
import { ArticleModel } from './articles/Article.model';

dotenv.config();
const { PORT = 3002}  = process.env;
const { DB_NAME = 'iparsebd'}  = process.env;



const app: Express = express();

app.use(bodyParser.json());
app.use(
  express.static(path.join(path.dirname(__dirname), 'public' ))
);

app.get('/', (req: Request, res: Response) => {
  res.send('Main page');
});

/*
app.get('/services/:slug', (req: Request, res: Response) => {
  res.send(`Service detail page with slug ${req.params?.slug}`);
});

app.get('/services', (req: Request, res: Response) => {
  res.send('Service-list page');
});


app.get('/articles/:slug', (req: Request, res: Response) => {
  res.send(`Article detail page with slug ${req.params?.slug}`);
});

app.get('/articles', (req: Request, res: Response) => {
  res.send('Articles-list page');
});

app.post('/articles', async ({ body }: Request<{}, {}, ArticleDto>, res: Response) => {

  const result = await ArticleModel.create({
    title: body.title,
    text: body.text,
    description: body.description
  });
 
  res.send({
    ok: result
  })
});
*/



async function start() {
  await mongoose.connect('mongodb://localhost:27017/parsedb');

  app.listen(PORT, () => {
    console.log(`Server has been started at http://localhost:${PORT}/!`);
  })
}


start();