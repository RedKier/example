import { App } from '@/app';
import { ValidateEnv } from '@config/validateEnv';
import { HealthRoutes } from '@routes/health.routes';
import { ProdutsRoutes } from '@routes/products.routes';

ValidateEnv();

const app = new App([new HealthRoutes(), new ProdutsRoutes()]);

app.listen();
