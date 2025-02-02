import { Product } from '@database/entities/product';
import { ProductsService } from '@services/productsService';
import { Inject, Service } from 'typedi';

interface CreateProductCommandPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface CreateProductCommandResult {
  data: Product;
}

@Service()
export class CreateProductCommand {
  constructor(
    @Inject()
    private readonly productsService: ProductsService,
  ) {}

  async execute(
    payload: CreateProductCommandPayload,
  ): Promise<CreateProductCommandResult> {
    const { name, description, price, stock } = payload;

    const product = await this.productsService.create(
      name,
      description,
      price,
      stock,
    );

    return { data: product };
  }
}
