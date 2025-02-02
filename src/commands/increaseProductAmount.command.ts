import { ProductsService } from '@services/productsService';
import { HttpException } from '@/exceptions/http.exception';
import { Inject, Service } from 'typedi';
import { Product } from '@database/entities/product';

interface IncreaseProductAmountCommandPayload {
  id: string;
  amount: number;
}

interface IncreaseProductAmountCommandResult {
  data: Product;
}

@Service()
export class IncreaseProductAmountCommand {
  constructor(
    @Inject()
    private readonly productsService: ProductsService,
  ) {}

  async execute(
    payload: IncreaseProductAmountCommandPayload,
  ): Promise<IncreaseProductAmountCommandResult> {
    const { id, amount } = payload;

    const product = await this.productsService.findOneById(id);

    if (!product) {
      throw new HttpException(404, `Product with id: ${id} not found.`);
    }

    const updatedProduct = await this.productsService.changeProductStock(
      product,
      { stock: product.stock + amount },
    );

    return { data: updatedProduct };
  }
}
