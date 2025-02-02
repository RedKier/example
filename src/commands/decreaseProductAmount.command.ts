import { HttpException } from '@/exceptions/http.exception';
import { Inject, Service } from 'typedi';
import { ProductsService } from '@services/productsService';
import { Product } from '@database/entities/product';

interface DecreaseProductAmountCommandPayload {
  id: string;
  amount: number;
}

interface DecreaseProductAmountCommandResult {
  data: Product;
}

@Service()
export class DecreaseProductAmountCommand {
  constructor(
    @Inject()
    private readonly productsService: ProductsService,
  ) {}

  async execute(
    payload: DecreaseProductAmountCommandPayload,
  ): Promise<DecreaseProductAmountCommandResult> {
    const { id, amount } = payload;

    const product = await this.productsService.findOneById(id);

    if (!product) {
      throw new HttpException(404, `Product with id: ${id} not found.`);
    }

    if (product.stock < amount) {
      throw new HttpException(400, `Product stock can't be decreased below 0.`);
    }

    const updatedProduct = await this.productsService.changeProductStock(
      product,
      { stock: product.stock - amount },
    );

    return { data: updatedProduct };
  }
}
