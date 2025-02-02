import request from 'supertest';
import { faker } from '@faker-js/faker';

import { App } from '@/app';
import { HealthRoutes } from '@routes/health.routes';
import { ProdutsRoutes } from '@routes/products.routes';
import { ValidateEnv } from '@config/validateEnv';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { dbInit } from './utils/database.utils';
import { Product } from '@database/entities/product';

ValidateEnv();

const app = new App([new HealthRoutes(), new ProdutsRoutes()]);

describe('Testing Products routes', () => {
  let db: MikroORM;
  let em: EntityManager;

  beforeAll(async () => {
    db = await dbInit();
    em = db.em.fork();
  });

  describe('[GET] /products', () => {
    it('[200]should return list of products', async () => {
      await request(app.getServer()).get(`/products`).expect(200);
    });
  });

  describe('[POST] /products', () => {
    beforeEach(async () => {
      await db.getSchemaGenerator().clearDatabase();
    });

    it('[201] should create product', async () => {
      const payload = {
        name: faker.string.alpha({ length: 10 }),
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: 1, max: 10 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(201)
        .expect(({ body }) => {
          expect(body.data.name).toEqual(payload.name);
          expect(body.data.name).toEqual(payload.name);
          expect(body.data.description).toEqual(payload.description);
          expect(body.data.price).toEqual(payload.price);
          expect(body.data.stock).toEqual(payload.stock);
        });
    });

    it('[400] should throw when name is not provided', async () => {
      const payload = {
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: 1, max: 10 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });

    it('[400] should throw when description is not provided', async () => {
      const payload = {
        name: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: 1, max: 10 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });

    it('[400] should throw when price is not provided', async () => {
      const payload = {
        name: faker.string.alpha({ length: 10 }),
        description: faker.string.alpha({ length: 10 }),
        stock: faker.number.int({ min: 1, max: 10 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });

    it('[400] should throw when stock is not provided', async () => {
      const payload = {
        name: faker.string.alpha({ length: 10 }),
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });

    it('[400] should throw when price is negative', async () => {
      const payload = {
        name: faker.string.alpha({ length: 10 }),
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: -10, max: -1 }),
        stock: faker.number.int({ min: 1, max: 10 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });

    it('[400] should throw when stock is negative', async () => {
      const payload = {
        name: faker.string.alpha({ length: 10 }),
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: -10, max: -1 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });

    it('[400] should throw when name is too long', async () => {
      const payload = {
        name: faker.string.alpha({ length: 51 }),
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: -10, max: -1 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });

    it('[400] should throw when description is too long', async () => {
      const payload = {
        name: faker.string.alpha({ length: 50 }),
        description: faker.string.alpha({ length: 301 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: -10, max: -1 }),
      };

      await request(app.getServer())
        .post(`/products`)
        .send(payload)
        .expect(400);
    });
  });

  describe('[PATCH] /products/:id/restock', () => {
    let product: Product;

    beforeEach(async () => {
      const data = {
        name: faker.string.alpha({ length: 10 }),
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: 1, max: 10 }),
      };

      product = em.create(
        Product,
        new Product(data.name, data.description, data.price, data.stock),
      );

      await em.flush();
    });

    afterEach(async () => {
      await db.getSchemaGenerator().clearDatabase();
    });

    it('[200] should update product data by additional stock amount', async () => {
      const payload = { amount: faker.number.int({ min: 1, max: 10 }) };

      await request(app.getServer())
        .patch(`/products/${product.id}/restock`)
        .send(payload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.stock).toEqual(product.stock + payload.amount);
        });
    });

    it('[404] should throw when product not found', async () => {
      const payload = { amount: faker.number.int({ min: 6 }) };

      await request(app.getServer())
        .patch(`/products/${faker.string.uuid()}/restock`)
        .send(payload)
        .expect(404);
    });
  });

  describe('[PATCH] /products/:id/sell', () => {
    let product: Product;

    beforeEach(async () => {
      const data = {
        name: faker.string.alpha({ length: 10 }),
        description: faker.string.alpha({ length: 10 }),
        price: faker.number.int({ min: 1, max: 10 }),
        stock: faker.number.int({ min: 5, max: 10 }),
      };

      product = em.create(
        Product,
        new Product(data.name, data.description, data.price, data.stock),
      );

      await em.flush();
    });

    afterEach(async () => {
      await db.getSchemaGenerator().clearDatabase();
    });

    it('[200] should update product data and reduce stock by provided amount', async () => {
      const payload = { amount: faker.number.int({ min: 1, max: 5 }) };

      await request(app.getServer())
        .patch(`/products/${product.id}/sell`)
        .send(payload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.stock).toEqual(product.stock - payload.amount);
        });
    });

    it('[400] should throw when update product stock below zero', async () => {
      const payload = { amount: faker.number.int({ min: 6 }) };

      await request(app.getServer())
        .patch(`/products/${product.id}/sell`)
        .send(payload)
        .expect(400);
    });

    it('[404] should throw when product not found', async () => {
      const payload = { amount: faker.number.int({ min: 6 }) };

      await request(app.getServer())
        .patch(`/products/${faker.string.uuid()}/sell`)
        .send(payload)
        .expect(404);
    });
  });
});
