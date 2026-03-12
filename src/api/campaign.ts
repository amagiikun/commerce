import type { CampaignFilter, CampaignItem, PageResult } from '@/types';
import request from '@/utils/request';

export function fetchCampaigns(params: CampaignFilter) {
  return request.get<never, PageResult<CampaignItem>>('/campaigns', { params });
}

export const getCampaignList = fetchCampaigns;

export function fetchCampaignDetail(campaignId: string) {
  return request.get<never, CampaignItem>(`/campaigns/${campaignId}`);
}
