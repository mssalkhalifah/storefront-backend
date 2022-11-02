import { Express } from 'express';
import ProductController from './product.controller';

const productRouter = (app: Express): void => {
  app.get('/products', ProductController.getAllProducts);
  app.get('/products/:id', ProductController.getProductById);
  app.get('/products/category/:category', ProductController.getProductsByCategory);
  
  app.post('/product', ProductController.createProduct);
};

export default productRouter;
