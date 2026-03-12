import { Router } from 'express';
import type { AppRepository } from '../data/repository.js';
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/api-response.js';
import { buildDashboardSummary } from '../utils/dashboard.js';

export function createDashboardRouter(repository: AppRepository) {
  const router = Router();

  router.get(
    '/summary',
    asyncHandler(async (_request, response) => {
      const [users, products, orders, campaigns] = await Promise.all([
        repository.listAllUsers(),
        repository.listAllProducts(),
        repository.listAllOrders(),
        repository.listAllCampaigns(),
      ]);

      response.json(
        success(
          buildDashboardSummary({
            users,
            products,
            orders,
            campaigns,
          }),
        ),
      );
    }),
  );

  return router;
}
