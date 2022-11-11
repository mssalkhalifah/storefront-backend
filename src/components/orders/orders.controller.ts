import ServerError from '../../errors/errorServer';
import { NextFunction, Request, Response } from 'express';
import { ISerializedUser } from '../user/user.interfaces';
import { ICreateOrder, IOrderProduct } from './orders.interfaces';
import Order from './orders.model';
import DatabaseErrorCodes from '../../errors/dbErrorCodes';

export default class OrderController {
  static async getAllOrders(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await Order.index();
      
      res.status(200).send(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const order = await Order.show(Number(id));

      if (!order) {
        next(ServerError.fileNotFound(`order id ${id} does not exist`));
        return;
      }
      
      res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userSerialized: ISerializedUser = req.cookies.token;

      const newOrder: ICreateOrder = {
        user_id: userSerialized.id,
      };

      const order = await Order.create(newOrder);
      
      res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  }
  
  static async addProductToOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const userSerialized: ISerializedUser = req.cookies.token;
    const newProduct: IOrderProduct = req.body;

    try {
      const order = await Order.show(Number(id));

      if (!order) {
        next(ServerError.fileNotFound(`order id ${id} does not exist`));
        return;
      }

      // Current user can't add product to order that belongs to other users
      if (order.user_id !== userSerialized.id) {
        next(ServerError
          .unauthorized(`Order id ${order.id} with user id ${order.user_id} does belong to user id ${userSerialized.id}`));
        return;
      }
      
      newProduct.order_id = Number(id);
      const addProduct = await Order.addProduct(newProduct);

      res.status(200).send(addProduct);
    } catch (error) {
      if ((error as any).code === DatabaseErrorCodes.FOREIGN_KEY_VIOLATION) {
        next(ServerError.fileNotFound(`product id ${newProduct.product_id} does not exist`));
        return;
      }

      if ((error as any).code === DatabaseErrorCodes.UNIQUE_VIOLATION) {
        next(ServerError.conflictData(`order id ${id} with product id ${newProduct.product_id} already exist`));
        return;
      }
      
      next(error);
    }
  }
  
  static async getAllOrderProductsByOrderId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    try {
      const orderProducts = await Order.showAllOrderProductsByOrderId(Number(id)); 

      res.status(200).send(orderProducts);
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantityOfProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id, productId, quantity } = req.params;
  
    const orderProducts: IOrderProduct = {
      order_id: Number(id),
      product_id: Number(productId),
      quantity: Number(quantity),
    };

    try {
      const updatedOrderProduct = await Order.updateOrderProductsQuantity(orderProducts);

      if (!updatedOrderProduct) {
        next(ServerError.fileNotFound(`order id ${id} or product id ${productId} does not exist`));
        return;
      }

      res.status(200).send(updatedOrderProduct);
    } catch (error) {
      next(error);
    }
  }

  static async setOrderComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    try {
      const updatedOrder = await Order.setOrderComplete(Number(id));

      if (!updatedOrder) {
        next(ServerError.fileNotFound(`order id ${id} does not exist`));
        return;
      }

      res.status(200).send(updatedOrder);
    } catch (error) {
      next(error);
    }
  }
}
