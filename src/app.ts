import express, { Express, Request, Response } from 'express';



const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Main page');
});

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

app.listen(port, () => {
  console.log(`Server has been started at http://localhost:${port}/!`);
})