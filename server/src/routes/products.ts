import { Router } from 'express';
import type { ProductFilter, ProductItem } from '../contracts.js';
import type { AppRepository } from '../data/repository.js';
import { asyncHandler } from '../utils/async-handler.js';
import { readParamValue, readSingleValue } from '../utils/http.js';
import { HttpError, success } from '../utils/api-response.js';

export function createProductRouter(repository: AppRepository) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (request, response) => {
      const result = await repository.listProducts({
        page: Number(readSingleValue(request.query.page) ?? 1),
        pageSize: Number(readSingleValue(request.query.pageSize) ?? 10),
        keyword: readSingleValue(request.query.keyword),
        status: readSingleValue(request.query.status) as ProductFilter['status'],
        category: readSingleValue(request.query.category),
      });

      response.json(success(result));
    }),
  );

  router.patch(
    '/:id',
    asyncHandler(async (request, response) => {
      const product = await repository.updateProduct(
        readParamValue(request.params.id),
        (request.body ?? {}) as Partial<ProductItem>,
      );

      if (!product) {
        throw new HttpError(404, '商品不存在');
      }

      response.json(success(product, '商品信息已更新'));
    }),
  );

  return router;
}