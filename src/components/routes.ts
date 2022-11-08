import { Express } from 'express';
import productRouter from './product/product.routes';
import userRouter from './user/user.routes';

class Routing {
  api(app: Express): void {
    productRouter(app);
    userRouter(app);
  }
}

export default new Routing();
