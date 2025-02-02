import { Database } from '@database/index';
import { Product } from '@database/entities/product';
import { Inject, Service } from 'typedi';

@Service()
export class ProductsService {
  constructor(
    @Inject()
    private readonly database: Database,
  ) {}

  async getAll(): Promise<Product[]> {
    const data = await this.database.em.findAll(Product);

    return data;
  }

  async create(
    name: string,
    description: string,
    price: number,
    stock: number,
  ): Promise<Product> {
    const data = this.database.em.create(
      Product,
      new Product(name, description, price, stock),
    );

    await this.database.em.flush();

    return data;
  }

  async findOneById(id: string): Promise<Product | null> {
    const data = await this.database.em.findOne(Product, { id });

    return data;
  }

  async changeProductStock(
    product: Product,
    updatePayload: Partial<Product>,
  ): Promise<Product> {
    const data = this.database.em.upsert(Product, {
      ...product,
      ...updatePayload,
    });

    return data;
  }
}
