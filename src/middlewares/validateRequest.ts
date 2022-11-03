import ServerError from '../errors/errorServer';
import { Request, Response, NextFunction } from 'express';
import { IValidationSchema } from '../utils/joiInterfaces';

export const validateRequest = (schema: IValidationSchema): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return async (req:Request, _res: Response, next: NextFunction): Promise<void> => {
    const { body, params } = req;

    try {
      if (schema.body) {
        await schema.body.validateAsync(body);
      }

      if (schema.params) {
        await schema.params.validateAsync(params);
      }

      next();
    } catch (error) {
      next(ServerError.invalidParameters(`${error}`));
    }
  };
};
