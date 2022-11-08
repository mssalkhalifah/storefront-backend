import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler';
import Routing from './components/routes';

const app = express();
const address: string = '0.0.0.0:3000';

app.use(express.json());
app.use(cookieParser());

app.get('/', (_req: Request, res: Response): void => {
  res.send('Hello World!');
});

Routing.api(app);

app.use(errorHandler);

app.listen(3000, (): void => {
  console.log(`starting app on: ${address}`);
});

export default app;
