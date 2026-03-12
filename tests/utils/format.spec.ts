import { describe, expect, it } from 'vitest';

import { formatAmount, formatPercent, formatTrendValue } from '../../src/utils/format';

describe('utils/format', () => {
  it('金额格式化保留千分位和人民币符号', () => {
    expect(formatAmount(1286400)).toBe('¥1,286,400');
  });

  it('百分比格式化默认保留两位小数', () => {
    expect(formatPercent(0.1536)).toBe('15.36%');
  });

  it('趋势值会保留正负号', () => {
    expect(formatTrendValue(12.8)).toBe('+12.8%');
    expect(formatTrendValue(-3.2)).toBe('-3.2%');
  });
});
