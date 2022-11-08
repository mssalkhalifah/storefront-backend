import Joi from 'joi';
import { IValidationSchema } from '../../utils/joiInterfaces';

const passwordValidation = Joi.string().required()
  .min(8)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  .required()
  .messages({
    'string.pattern.base': 'password must include at least one letter, one number and one special character',
  });

export const createUserValidation: IValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: passwordValidation,
  }).required(),
};

export const loginValidation: IValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: passwordValidation,
  }).required(),
};

export const getUserValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }).required(),
};
