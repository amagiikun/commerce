import { describe, expect, it } from 'vitest';

import { buildListQueryParams, omitEmptyFilters } from '../../src/utils/query';

describe('utils/query', () => {
  it('能够构造列表页查询参数', () => {
    const params = buildListQueryParams({
      page: 2,
      pageSize: 20,
      filters: {
        keyword: '蓝牙耳机',
        status: 'on_sale',
        category: 'audio',
      },
    });

    expect(params).toEqual({
      page: 2,
      pageSize: 20,
      keyword: '蓝牙耳机',
      status: 'on_sale',
      category: 'audio',
    });
  });

  it('会移除 undefined、null、空字符串筛选项', () => {
    expect(
      omitEmptyFilters({
        keyword: '',
        status: undefined,
        campaign: null,
        category: 'digital',
      }),
    ).toEqual({
      category: 'digital',
    });
  });
});
