import { Product } from '@database/entities/product';
import { ProductsService } from '@services/productsService';
import { Inject, Service } from 'typedi';

interface GetProductsQueryResult {
  data: Product[];
}

@Service()
export class GetProductsQuery {
  productsService: ProductsService;

  constructor(@Inject() productsService: ProductsService) {
    this.productsService = productsService;
  }

  async execute(): Promise<GetProductsQueryResult> {
    const products = await this.productsService.getAll();

    return { data: products };
  }
}
