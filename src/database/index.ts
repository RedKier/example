import { EntityManager, MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Service } from 'typedi';
import options from './mikroOrm.config';

@Service()
export class Database {
  public orm: MikroORM;
  public em: EntityManager;

  constructor() {
    this.orm = MikroORM.initSync<PostgreSqlDriver>(options);
    this.em = this.orm.em.fork();

    this.orm.connect();
  }
}
