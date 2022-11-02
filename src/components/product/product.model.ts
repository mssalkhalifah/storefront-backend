import database from '../../database';
import { ICreateProduct, IProduct } from './product.interfaces';

export default class Product {
  static async index(): Promise<IProduct[]> {
    try {
      const sql = 'SELECT * FROM product';
      const conn = await database.client.connect();

      const result = await conn.query(sql);

      conn.release();

      const products = this.convertToProducts(result.rows);

      if (products.length) {
        return products;
      }

      return [];
    } catch (error) {
      throw new Error('Could not get all products');
    }
  }

  static async create(newProduct: ICreateProduct): Promise<IProduct> {
    try {
      const sql = 'INSERT INTO product (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const conn = await database.client.connect();

      const result = await conn.query(
        sql,
        [newProduct.name, newProduct.price, newProduct.category],
      );

      const product = this.convertToProducts(result.rows)[0];

      conn.release();

      product.price = Number(product.price);

      return product;
    } catch (error) {
      throw new Error(`Could not add a new product: ${newProduct}`);
    }
  }

  static async show(id: number): Promise<IProduct | null> {
    try {
      const sql = 'SELECT * FROM product WHERE id=$1';
      const conn = await database.client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      const product = this.convertToProducts(result.rows)[0];

      if (product) {
        return product;
      } 

      return null;
    } catch (error) {
      throw new Error('Could not get product');
    }
  }

  static async getAllByCategory(category: string): Promise<IProduct[] | null> {
    try {
      const sql = 'SELECT * FROM product WHERE category=$1';
      const conn = await database.client.connect();

      const result = await conn.query(sql, [category]);

      conn.release();

      const products = this.convertToProducts(result.rows);

      if (products.length) {
        return products;
      }

      return null;
    } catch (error) {
      throw new Error('Could not get products by category');
    }
  }

  private static convertToProducts(products: any[]): IProduct[] {
    products.forEach((product: IProduct): void => {
      product.price = Number(product.price);
    });

    return products;
  }
}
