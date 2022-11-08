import { Express } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createProductValidation, getProductValidation } from './product.schemas';
import ProductController from './product.controller';
import { jwtAuthenticator } from '../../middlewares/jwtAuthenticator';

const productRouter = (app: Express): void => {
  app.get('/products', ProductController.getAllProducts);
  app.get('/products/:id', validateRequest(getProductValidation), ProductController.getProductById);
  app.get('/products/category/:category', ProductController.getProductsByCategory);
  
  app.post('/product', 
    jwtAuthenticator, 
    validateRequest(createProductValidation), 
    ProductController.createProduct);
};

export default productRouter;
