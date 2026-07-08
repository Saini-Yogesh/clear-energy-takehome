import { formatCurrency } from './formatter';

describe('formatCurrency', () => {
  it('should format paise to INR currency in Indian locale', () => {
    // 1 Rupee = 100 paise
    expect(formatCurrency(100)).toBe('₹1.00');

    // 0 paise
    expect(formatCurrency(0)).toBe('₹0.00');

    // ₹1,234.56 (123456 paise)
    expect(formatCurrency(123456)).toBe('₹1,234.56');

    // ₹1,00,000.00 (10000000 paise - 1 Lakh)
    expect(formatCurrency(10000000)).toBe('₹1,00,000.00');
  });

  it('should handle negative and invalid values gracefully', () => {
    expect(formatCurrency(-500)).toBe('-₹5.00');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(formatCurrency(null as any)).toBe('₹0.00');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(formatCurrency(undefined as any)).toBe('₹0.00');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(formatCurrency(NaN as any)).toBe('₹0.00');
  });
});
