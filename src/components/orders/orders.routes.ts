import { Express } from 'express';
import OrderController from './orders.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { jwtAuthenticator } from '../../middlewares/jwtAuthenticator';
import { addProductToOrder, getOrderValidation, updateQuantityValidation } from './orders.schemas';

const orderRouter = (app: Express): void => {
  app.get('/orders', jwtAuthenticator, OrderController.getAllOrders);
  app.get('/orders/:id', jwtAuthenticator, validateRequest(getOrderValidation), OrderController.getOrderById);
  app.get('/orders/:id/orderProducts', 
    jwtAuthenticator, 
    validateRequest(getOrderValidation),
    OrderController.getAllOrderProductsByOrderId);
  app.get('/orders/:id/product/:productId/update/quantity/:quantity',
    jwtAuthenticator,
    validateRequest(updateQuantityValidation),
    OrderController.updateQuantityOfProduct);

  app.post('/orders/:id/setcomplete', 
    jwtAuthenticator, 
    validateRequest(getOrderValidation),
    OrderController.setOrderComplete);
  app.post('/order/create', jwtAuthenticator, OrderController.createOrder);
  app.post('/orders/:id/addProduct', 
    jwtAuthenticator, 
    validateRequest(addProductToOrder), 
    OrderController.addProductToOrder);
};

export default orderRouter;
