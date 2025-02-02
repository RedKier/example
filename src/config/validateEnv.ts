import { cleanEnv, port, str, num } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    ORIGIN: str(),
    PORT: port(),
    DB_NAME: str(),
    DB_PASSWORD: str(),
    DB_USER: str(),
    DB_HOST: str(),
    DB_PORT: num(),
  });
};
