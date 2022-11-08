import { Request, Response, NextFunction } from 'express';
import ErrorException from '../errors/errorException';

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errorException = error as ErrorException;

  if (errorException.statusCode && errorException.statusCode < 500) {
    res
      .status(errorException.statusCode)
      .send({ statusCode: errorException.statusCode, message: errorException.message });
  } else {
    console.log(error);
    res.status(500).send({ statusCode: 500, message: 'Something went wrong.' });
  }

  next();
};

export default errorHandler;
