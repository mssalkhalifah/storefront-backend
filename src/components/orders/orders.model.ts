import database from '../../database';
import { ICreateOrder, IOrder, IOrderProduct, IOrderProductSerialized } from './orders.interfaces';

export default class Order {
  private static readonly TABLE_NAME: string = 'orders';

  static async index(): Promise<IOrder[]> {
    try {
      const sql = `SELECT ${this.TABLE_NAME}.id, order_status.status, ${this.TABLE_NAME}.user_id
                    FROM ${this.TABLE_NAME}
                    JOIN order_status ON ${this.TABLE_NAME}.status_id=order_status.id`;
      const conn = await database.client.connect();

      const result = await conn.query(sql);

      conn.release();

      return Array.from(result.rows);
    } catch (error) {
      throw error;
    }
  }

  static async show(id: number): Promise<IOrder> {
    try {
      const sql = `SELECT ${this.TABLE_NAME}.id, order_status.status, ${this.TABLE_NAME}.user_id
                    FROM ${this.TABLE_NAME}
                    JOIN order_status ON ${this.TABLE_NAME}.status_id=order_status.id
                    WHERE ${this.TABLE_NAME}.id=$1`;
      const conn = await database.client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(newOrder: ICreateOrder): Promise<IOrder> {
    try {
      const conn = await database.client.connect();

      let sql = `INSERT INTO ${this.TABLE_NAME} (status_id, user_id) VALUES ($1, $2) RETURNING id`;
      const status = 1;

      const temp = await conn.query(sql, [status, newOrder.user_id]);
      const insertedOrder: IOrder = temp.rows[0];

      sql = `SELECT ${this.TABLE_NAME}.id, order_status.status, ${this.TABLE_NAME}.user_id 
              FROM ${this.TABLE_NAME} 
              JOIN order_status ON ${this.TABLE_NAME}.status_id=order_status.id 
              WHERE ${this.TABLE_NAME}.id=$1`;

      const result = await conn.query(sql, [insertedOrder.id]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async addProduct(newOrderProduct: IOrderProduct): Promise<IOrderProduct> {
    try {
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      const conn = await database.client.connect();
      
      const result = await conn.query(sql, 
        [newOrderProduct.order_id, newOrderProduct.product_id, newOrderProduct.quantity]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async showAllOrderProductsByOrderId(id: number): Promise<IOrderProduct[]> {
    try {
      const sql = 'SELECT * FROM order_products WHERE order_id=$1';
      const conn = await database.client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return Array.from(result.rows);
    } catch (error) {
      throw error;
    }
  }
  
  static async updateOrderProductsQuantity(orderProducts: IOrderProductSerialized): Promise<IOrderProduct> {
    try {
      const sql = 'UPDATE order_products SET quantity=$1 WHERE order_id=$2 AND product_id=$3 RETURNING *';
      const conn = await database.client.connect();

      const result = await conn.query(sql, 
        [orderProducts.quantity, orderProducts.order_id, orderProducts.product_id]);
      
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async setOrderComplete(id: number): Promise<IOrder | null> {
    try {
      let sql = 'UPDATE orders SET status_id=$1 WHERE id=$2 RETURNING id';
      const status = 2;
      const conn = await database.client.connect();

      let result = await conn.query(sql, [status, id]);

      sql = `SELECT ${this.TABLE_NAME}.id, order_status.status, ${this.TABLE_NAME}.user_id
                    FROM ${this.TABLE_NAME}
                    JOIN order_status ON ${this.TABLE_NAME}.status_id=order_status.id
                    WHERE ${this.TABLE_NAME}.id=$1`;
      
      if (!result.rows[0]) {
        return null;
      }

      result = await conn.query(sql, [result.rows[0].id]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}
