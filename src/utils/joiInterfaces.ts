import Joi from 'joi';

export interface IValidationSchema {
  headers?: Joi.ObjectSchema,
  body?: Joi.ObjectSchema,
  params?: Joi.ObjectSchema,
  query?: Joi.ObjectSchema
}
