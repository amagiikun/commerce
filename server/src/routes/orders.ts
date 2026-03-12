import { Router } from 'express';
import type { OrderFilter } from '../contracts.js';
import type { AppRepository } from '../data/repository.js';
import { asyncHandler } from '../utils/async-handler.js';
import { readParamValue, readSingleValue } from '../utils/http.js';
import { HttpError, success } from '../utils/api-response.js';

export function createOrderRouter(repository: AppRepository) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (request, response) => {
      const result = await repository.listOrders({
        page: Number(readSingleValue(request.query.page) ?? 1),
        pageSize: Number(readSingleValue(request.query.pageSize) ?? 10),
        keyword: readSingleValue(request.query.keyword),
        status: readSingleValue(request.query.status) as OrderFilter['status'],
        channel: readSingleValue(request.query.channel),
      });

      response.json(success(result));
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (request, response) => {
      const order = await repository.getOrderById(readParamValue(request.params.id));

      if (!order) {
        throw new HttpError(404, '订单不存在');
      }

      response.json(success(order));
    }),
  );

  return router;
}