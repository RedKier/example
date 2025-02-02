import options from '@database/mikroOrm.config';
import { MikroORM } from '@mikro-orm/core';

export const dbInit = async (): Promise<MikroORM> => {
  const orm = await MikroORM.init(options);

  return orm;
};
