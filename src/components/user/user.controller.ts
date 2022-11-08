import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ICreateUser, ISerializedUser } from './user.interfaces';
import DatabaseErrorCodes from '../../errors/dbErrorCodes';
import ServerError from '../../errors/errorServer';
import User from './user.model';

export default class UserController {
  static async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.index();

      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }
  
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    
    const user = await User.show(Number(id));

    if (!user) {
      next(ServerError.fileNotFound(`user id ${id} does not exist`));
      return;
    }

    res.status(200).send(user);
  }
  
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const newUser: ICreateUser = req.body;

    try {
      const createdUser = await User.create(newUser);
      const serializedUser: ISerializedUser = createdUser; 

      serializedUser.password = undefined;

      const token = jwt.sign(serializedUser, process.env.MY_SECRET_KEY!, { expiresIn: '15m' });

      res.cookie('token', token, {
        httpOnly: true,
      });

      res.status(201).send(token);
    } catch (error) {
      if ((error as Error).message === DatabaseErrorCodes.UNIQUE_VIOLATION) {
        next(ServerError.conflictData(`"${newUser.email}" is already taken`));
      } else {
        next(error);
      }
    }
  }

  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userSerialized: ISerializedUser = req.cookies.token;

      res.status(200).send(userSerialized);
    } catch (error) {
      next(error);
    }
  }

  static async logoutCurrentUser(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('token');
      res.status(200).send('successfully logged out');
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userSerialized: ISerializedUser = req.body;
      
      const user = await User.getUserByEmail(userSerialized.email);

      if (!user) {
        next(ServerError.unauthorized(`email "${userSerialized.email}" does not exist`));
        return;
      }

      const validPassword = await bcrypt.compare(userSerialized.password!, user.user_password);

      if (!validPassword) {
        next(ServerError.unauthorized('password is incorrect'));
        return;
      }

      const token = jwt.sign(userSerialized, process.env.MY_SECRET_KEY!, { expiresIn: '15m' });

      res.cookie('token', token, {
        httpOnly: true,
      });

      res.status(200).send('successfully logged in');
    } catch (error) {
      next(error);
    }
  }
}
