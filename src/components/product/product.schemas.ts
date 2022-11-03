import Joi from 'joi';
import { IValidationSchema } from '../../utils/joiInterfaces';

export const createProductValidation: IValidationSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
  }).required(),
};

export const getProductValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }).required(),
};
