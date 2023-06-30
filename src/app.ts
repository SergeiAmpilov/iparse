import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { engine } from 'express-handlebars';
import nodemailer from 'nodemailer';
import { ArticleDto } from './articles/Article.dto';
import { ArticleModel } from './articles/Article.model';
import { trunc } from './functions/Truncate.function';
import { ContactFormDto } from './contact-form/ContactForm.dto';
import { ContactFormModel } from './contact-form/ContactForm.model';
import { router } from './routes/router';

dotenv.config();

const { 
  PORT = 3002,
  DB_NAME = 'iparsebd',
}  = process.env;


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

app.use(router);

async function start() {
  await mongoose.connect(`mongodb://0.0.0.0:27017/${DB_NAME}`);

  app.listen(PORT, () => {
    console.log(`Server has been started at http://localhost:${PORT}/`);
  })
}

start();