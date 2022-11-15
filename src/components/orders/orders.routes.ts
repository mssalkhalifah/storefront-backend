import { Express } from 'express';
import OrderController from './orders.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { jwtAuthenticator } from '../../middlewares/jwtAuthenticator';
import { addProductToOrder, getOrderValidation, updateQuantityValidation } from './orders.schemas';

const orderRouter = (app: Express): void => {
  app.get('/orders', jwtAuthenticator, OrderController.getAllOrders);
  app.get('/order/:id', jwtAuthenticator, validateRequest(getOrderValidation), OrderController.getOrderById);
  app.get('/order/:id/orderProducts', 
    jwtAuthenticator, 
    validateRequest(getOrderValidation),
    OrderController.getAllOrderProductsByOrderId);

  app.post('/order/:id/product/:productId/update/quantity/:quantity',
    jwtAuthenticator,
    validateRequest(updateQuantityValidation),
    OrderController.updateQuantityOfProduct);
  app.post('/order/:id/setcomplete', 
    jwtAuthenticator, 
    validateRequest(getOrderValidation),
    OrderController.setOrderComplete);
  app.post('/order/create', jwtAuthenticator, OrderController.createOrder);
  app.post('/order/:id/addProduct', 
    jwtAuthenticator, 
    validateRequest(addProductToOrder), 
    OrderController.addProductToOrder);
};

export default orderRouter;
