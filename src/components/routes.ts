import { Express } from 'express';
import productRouter from './product/product.routes';

class Routing {
  api(app: Express): void {
    productRouter(app);
  }
}

export default new Routing();
