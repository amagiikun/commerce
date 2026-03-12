import cors from 'cors';
import express from 'express';
import type { AppRepository } from './data/repository.js';
import { authenticateRequest } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { createAuthRouter } from './routes/auth.js';
import { createCampaignRouter } from './routes/campaigns.js';
import { createDashboardRouter } from './routes/dashboard.js';
import { createOrderRouter } from './routes/orders.js';
import { createProductRouter } from './routes/products.js';
import { success } from './utils/api-response.js';

interface BuildAppOptions {
  repository: AppRepository;
}

export function buildApp(options: BuildAppOptions) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json(success({ status: 'ok' }));
  });

  app.use('/api/auth', createAuthRouter(options.repository));
  app.use('/api', authenticateRequest);
  app.use('/api/dashboard', createDashboardRouter(options.repository));
  app.use('/api/products', createProductRouter(options.repository));
  app.use('/api/orders', createOrderRouter(options.repository));
  app.use('/api/campaigns', createCampaignRouter(options.repository));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const createApp = buildApp;
