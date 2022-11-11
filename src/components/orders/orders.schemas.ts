
import Joi from 'joi';
import { IValidationSchema } from '../../utils/joiInterfaces';

export const getOrderValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }).required(),
};

export const updateQuantityValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
    productId: Joi.number().integer().required(),
  }).required(),
};

export const addProductToOrder: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),

  body: Joi.object({
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
  }).required(),
};
