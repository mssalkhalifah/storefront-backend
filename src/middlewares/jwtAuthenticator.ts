import ServerError from '../errors/errorServer';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const jwtAuthenticator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Skip authentication middleware if in test enviroment
  if (process.env.ENV! === 'test') {
    next();
    return;
  }

  const token: string = req.cookies?.token;
  // console.log(req.headers);
  try {
    req.cookies.token = jwt.verify(token, process.env.MY_SECRET_KEY!);

    next();
  } catch (error) {
    res.clearCookie('token');
    next(ServerError.unauthorized('user is unauthorized'));
  }
};
