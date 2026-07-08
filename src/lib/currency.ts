export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD (1 USD = X currency)
}

export const currencies: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1400 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.50 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 153 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rate: 12.50 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 157 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.45 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', rate: 17.15 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.89 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
];

export type Currency = typeof currencies[number]['code'];

export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return currencies.find((c) => c.code === code);
}

export function convertFromUSD(usdAmount: number, currencyCode: string): number {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) return usdAmount;
  return usdAmount * currency.rate;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) return `$${amount.toLocaleString()}`;

  // Format based on currency
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: currency.rate >= 100 ? 0 : 2,
    maximumFractionDigits: currency.rate >= 100 ? 0 : 2,
  });

  return `${currency.symbol}${formatted}`;
}

export function formatPrice(usdAmount: number, currencyCode: string): string {
  const amount = convertFromUSD(usdAmount, currencyCode);
  return formatCurrency(amount, currencyCode);
}

// For Paystack (always charges in NGN)
export function convertToNGN(usdAmount: number): number {
  const ngn = getCurrencyInfo('NGN');
  return usdAmount * (ngn?.rate || 1400);
}
