import { buildPageQuery, formatCurrency, formatRate } from '@/utils/format';

describe('format utils', () => {
  it('金额应格式化为人民币', () => {
    expect(formatCurrency(12000)).toContain('12,000');
  });

  it('比率应保留一位小数', () => {
    expect(formatRate(13.26)).toBe('13.3%');
  });

  it('分页查询参数应过滤空值', () => {
    expect(
      buildPageQuery({
        page: 1,
        pageSize: 10,
        keyword: '',
        status: 'running',
      }),
    ).toEqual({
      page: 1,
      pageSize: 10,
      status: 'running',
    });
  });
});
