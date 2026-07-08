export const EXCHANGE_RATE = 1400;

export type Currency = 'USD' | 'NGN';

export function convertToNGN(usdAmount: number): number {
  return usdAmount * EXCHANGE_RATE;
}

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString()}`;
  }
  return `₦${amount.toLocaleString()}`;
}

export function formatPrice(usdAmount: number, currency: Currency): string {
  const amount = currency === 'NGN' ? convertToNGN(usdAmount) : usdAmount;
  return formatCurrency(amount, currency);
}
