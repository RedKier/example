import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';

export const CreateProductBodySchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(300).required(),
  price: Joi.number().min(1).integer().required(),
  stock: Joi.number().min(1).integer().required(),
});

export interface CreateProductRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    description: string;
    price: number;
    stock: number;
  };
}
