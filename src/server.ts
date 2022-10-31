import express, { Request, Response } from 'express';
// import bodyParser from 'body-parser';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.get('/', (_req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.listen(3000, (): void => {
  console.log(`starting app on: ${address}`);
});
