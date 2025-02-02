import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import * as Joi from 'joi';

export const IncreaseProductStockBodySchema = Joi.object({
  amount: Joi.number().min(1).integer().required(),
});

export const IncreaseProductStockParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export interface IncreaseProductStocRequestSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    amount: number;
  };
  [ContainerTypes.Params]: {
    id: string;
  };
}
