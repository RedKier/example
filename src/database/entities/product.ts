import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Product {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ hidden: true })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), hidden: true })
  updatedAt: Date = new Date();

  @Property({ nullable: false, length: 50 })
  name: string;

  @Property({ nullable: false, type: 'varchar', length: 300 })
  description: string;

  @Property({ nullable: false, type: 'int' })
  price: number;

  @Property({ nullable: false, type: 'int' })
  stock: number;

  constructor(name: string, description: string, price: number, stock: number) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }
}
