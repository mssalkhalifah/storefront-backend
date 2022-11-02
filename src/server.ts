import express, { Request, Response } from 'express';
import Routing from './components/routes';

const app = express();
const address: string = '0.0.0.0:3000';

app.use(express.json());

app.get('/', (_req: Request, res: Response): void => {
  res.send('Hello World!');
});

Routing.api(app);

app.listen(3000, (): void => {
  console.log(`starting app on: ${address}`);
});

export default app;
