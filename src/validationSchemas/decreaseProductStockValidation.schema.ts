import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';

export const DecreaseProductStockBodySchema = Joi.object({
  amount: Joi.number().min(1).integer().required(),
});

export const DecreaseProductStockParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export interface DecreaseProductStocRequestSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    amount: number;
  };
  [ContainerTypes.Params]: {
    id: string;
  };
}
