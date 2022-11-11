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
      const users: ISerializedUser[] = await User.index();

      users.forEach((user: ISerializedUser): void => {user.user_password = undefined;});

      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }
  
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    
    const user: ISerializedUser = await User.show(Number(id));

    if (!user) {
      next(ServerError.fileNotFound(`user id ${id} does not exist`));
      return;
    }

    user.user_password = undefined;

    res.status(200).send(user);
  }
  
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const newUser: ICreateUser = req.body;

    try {
      const createdUser = await User.create(newUser);
      const serializedUser: ISerializedUser = createdUser; 

      serializedUser.user_password = undefined;

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
      const { email, password } = req.body;
      
      const user = await User.getUserByEmail(email);

      if (!user) {
        next(ServerError.unauthorized(`email "${email}" does not exist`));
        return;
      }

      const validPassword = await bcrypt.compare(password, user.user_password);

      if (!validPassword) {
        next(ServerError.unauthorized('password is incorrect'));
        return;
      }

      const userSerialized: ISerializedUser = user;
      userSerialized.user_password = undefined;

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
