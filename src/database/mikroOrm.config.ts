import path from 'path';

import { Options, ReflectMetadataProvider } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '@config/index';
import { Product } from './entities/product';

const options: Options<PostgreSqlDriver> = {
  metadataProvider: ReflectMetadataProvider,
  entities: [Product],
  driver: PostgreSqlDriver,
  dbName: DB_NAME,
  password: DB_PASSWORD,
  user: DB_USER,
  host: DB_HOST,
  port: parseInt(DB_PORT!),
  migrations: {
    tableName: 'migrations',
    allOrNothing: true,
    path: path.join(process.cwd(), 'dist/src/database/migrations'),
    pathTs: path.join(process.cwd(), 'src/database/migrations'),
  },
};

export default options;
