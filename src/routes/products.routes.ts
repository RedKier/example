import { NextFunction, Request, Response, Router } from 'express';
import { createValidator, ValidatedRequest } from 'express-joi-validation';
import Container from 'typedi';

import { Routes } from '@/interfaces/routes.interface';
import { CreateProductCommand } from '@/commands/createProduct.command';
import { GetProductsQuery } from '@/queries/getProducts.query';
import { DecreaseProductAmountCommand } from '@/commands/decreaseProductAmount.command';
import { IncreaseProductAmountCommand } from '@/commands/increaseProductAmount.command';
import {
  CreateProductBodySchema,
  CreateProductRequestSchema,
} from '@validationSchemas/createProductValidation.schema';
import {
  IncreaseProductStockBodySchema,
  IncreaseProductStockParamsSchema,
  IncreaseProductStocRequestSchema,
} from '@validationSchemas/increaseProductStockValidation.schema';
import {
  DecreaseProductStockBodySchema,
  DecreaseProductStockParamsSchema,
  DecreaseProductStocRequestSchema,
} from '@validationSchemas/decreaseProductStockValidation.schema';
export class ProdutsRoutes implements Routes {
  public path = '/products';
  public router = Router();
  public validator = createValidator();

  public increaseProductAmountCommand: IncreaseProductAmountCommand;
  public decreaseProductAmountCommand: DecreaseProductAmountCommand;
  public createProductCommand: CreateProductCommand;
  public getProductsQuery: GetProductsQuery;

  constructor() {
    this.loadRoutes();

    this.increaseProductAmountCommand = Container.get(
      IncreaseProductAmountCommand,
    );
    this.decreaseProductAmountCommand = Container.get(
      DecreaseProductAmountCommand,
    );
    this.createProductCommand = Container.get(CreateProductCommand);
    this.getProductsQuery = Container.get(GetProductsQuery);
  }

  private loadRoutes() {
    this.router.get(this.path, this.getProducts.bind(this));

    this.router.post(
      this.path,
      this.validator.body(CreateProductBodySchema),
      this.createProduct.bind(this),
    );

    this.router.patch(
      `${this.path}/:id/restock`,
      this.validator.params(IncreaseProductStockParamsSchema),
      this.validator.body(IncreaseProductStockBodySchema),
      this.restockProduct.bind(this),
    );

    this.router.patch(
      `${this.path}/:id/sell`,
      this.validator.params(DecreaseProductStockParamsSchema),
      this.validator.body(DecreaseProductStockBodySchema),
      this.sellProduct.bind(this),
    );
  }

  private async getProducts(
    _request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { data } = await this.getProductsQuery.execute();

      response.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  private async createProduct(
    request: ValidatedRequest<CreateProductRequestSchema>,
    response: Response,
    next: NextFunction,
  ) {
    const { name, description, price, stock } = request.body;

    try {
      const { data } = await this.createProductCommand.execute({
        name,
        description,
        price,
        stock,
      });

      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  private async restockProduct(
    request: ValidatedRequest<IncreaseProductStocRequestSchema>,
    response: Response,
    next: NextFunction,
  ) {
    const { id } = request.params;
    const { amount } = request.body;

    try {
      const { data } = await this.increaseProductAmountCommand.execute({
        id,
        amount,
      });

      response.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  private async sellProduct(
    request: ValidatedRequest<DecreaseProductStocRequestSchema>,
    response: Response,
    next: NextFunction,
  ) {
    const { id } = request.params;
    const { amount } = request.body;

    try {
      const { data } = await this.decreaseProductAmountCommand.execute({
        id,
        amount,
      });

      response.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
