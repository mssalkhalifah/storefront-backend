import { Express } from 'express';
import productRouter from './product/product.routes';
import userRouter from './user/user.routes';
import orderRouter from './orders/orders.routes';

class Routing {
  api(app: Express): void {
    productRouter(app);
    userRouter(app);
    orderRouter(app);
  }
}

export default new Routing();
