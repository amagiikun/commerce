import { Router } from 'express';
import type { CampaignFilter } from '../contracts.js';
import type { AppRepository } from '../data/repository.js';
import { asyncHandler } from '../utils/async-handler.js';
import { readParamValue, readSingleValue } from '../utils/http.js';
import { HttpError, success } from '../utils/api-response.js';

export function createCampaignRouter(repository: AppRepository) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (request, response) => {
      const result = await repository.listCampaigns({
        page: Number(readSingleValue(request.query.page) ?? 1),
        pageSize: Number(readSingleValue(request.query.pageSize) ?? 10),
        keyword: readSingleValue(request.query.keyword),
        status: readSingleValue(request.query.status) as CampaignFilter['status'],
      });

      response.json(success(result));
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (request, response) => {
      const campaign = await repository.getCampaignById(readParamValue(request.params.id));

      if (!campaign) {
        throw new HttpError(404, '活动不存在');
      }

      response.json(success(campaign));
    }),
  );

  return router;
}