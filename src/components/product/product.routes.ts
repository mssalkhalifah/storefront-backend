import { Express } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createProductValidation, getProductValidation } from './product.schemas';
import ProductController from './product.controller';

const productRouter = (app: Express): void => {
  app.get('/products', ProductController.getAllProducts);
  app.get('/products/:id', validateRequest(getProductValidation), ProductController.getProductById);
  app.get('/products/category/:category', ProductController.getProductsByCategory);
  
  app.post('/product', validateRequest(createProductValidation), ProductController.createProduct);
};

export default productRouter;
