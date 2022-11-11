import database from '../../database';
import bcrypt from 'bcrypt';
import { ICreateUser, IUser } from './user.interfaces';

export default class User {
  private static readonly TABLE_NAME: string = 'users';

  static async index(): Promise<IUser[]> {
    try {
      const sql = `SELECT * FROM ${this.TABLE_NAME}`;
      const conn = await database.client.connect();

      const result = await conn.query(sql);

      conn.release();

      return Array.from(result.rows);
    } catch (error) {
      throw new Error(`Cannot get all users ${error}`);
    }
  }

  static async show(id: number): Promise<IUser> {
    try {
      const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id=$1`;
      const conn = await database.client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get user ${error}`);
    }
  }

  static async getUserByEmail(email: string): Promise<IUser> {
    try {
      const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE email=$1`;
      const conn = await database.client.connect();

      const result = await conn.query(sql, [email]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get user ${error}`);
    }
  }

  static async create(newUser: ICreateUser): Promise<IUser> {
    try {
      const sql = `INSERT INTO ${this.TABLE_NAME} (email, firstname, lastname, user_password) VALUES($1, $2, $3, $4) RETURNING *`;
      const conn = await database.client.connect();

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      const result = await conn.query(
        sql,
        [newUser.email, newUser.firstname, newUser.lastname, hashedPassword],
      );

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`${(error as any).code}`);
    }
  }
}
